import base64
import io
import json
import os
import uuid
from typing import List, Optional

import httpx
import openai
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image

router = APIRouter()


def _create_thumbnail(image_bytes: bytes) -> str:
    img = Image.open(io.BytesIO(image_bytes))
    img.thumbnail((128, 128))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    encoded = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/png;base64,{encoded}"


def _ocr_addresses(image_bytes: bytes) -> List[str]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not configured")

    openai.api_key = api_key
    openai.base_url = os.getenv("OPENAI_BASE_URL")
    openai.api_type = "azure"
    openai.api_version = os.getenv("OPENAI_API_VERSION")
    deployment = os.getenv("OPENAI_DEPLOYMENT_NAME")

    img_b64 = base64.b64encode(image_bytes).decode()
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": (
                        "Extract all street addresses from this image and return"
                        " them as a JSON array of strings."
                    ),
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{img_b64}"},
                },
            ],
        }
    ]
    try:
        resp = openai.chat.completions.create(
            deployment_id=deployment, messages=messages, max_tokens=200
        )
    except Exception as exc:  # pragma: no cover - network
        raise HTTPException(500, detail="OCR request failed") from exc

    try:
        text = resp.choices[0].message.content.strip()
        return json.loads(text)
    except Exception as exc:  # pragma: no cover - parsing
        raise HTTPException(500, detail="Invalid OCR response") from exc


def _geocode(address: str) -> Optional[dict]:
    token = os.getenv("MAPBOX_API_KEY")
    if not token:
        raise RuntimeError("MAPBOX_API_KEY not configured")
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json"
    params = {"access_token": token, "limit": 1}
    resp = httpx.get(url, params=params)
    resp.raise_for_status()
    data = resp.json()
    features = data.get("features")
    if not features:
        return None
    lng, lat = features[0]["geometry"]["coordinates"]
    return {"lat": lat, "lng": lng}


@router.post("/v1/extract")
async def extract(file: UploadFile = File(...)) -> JSONResponse:
    if file.content_type not in {"image/png", "image/jpeg"}:
        raise HTTPException(status_code=400, detail="Invalid file type")

    content = await file.read()
    thumbnail = _create_thumbnail(content)

    try:
        addresses = _ocr_addresses(content)
    except RuntimeError:
        addresses = []

    coords: List[Optional[dict]] = []
    for addr in addresses:
        try:
            coord = _geocode(addr)
        except RuntimeError:
            coord = None
        coords.append(coord)

    return JSONResponse(
        {
            "id": str(uuid.uuid4()),
            "thumbnail": thumbnail,
            "addresses": addresses,
            "coordinates": coords,
        }
    )
