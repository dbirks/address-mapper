import os
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()


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


@router.get("/v1/geocode")
async def geocode(address: str) -> Optional[dict]:
    coord = _geocode(address)
    if coord is None:
        raise HTTPException(status_code=404, detail="Address not found")
    return coord
