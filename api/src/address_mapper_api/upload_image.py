from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import base64
import io
import os
from typing import List, Dict, Any
import openai
import httpx

app = FastAPI()

# Add CORS middleware for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update for production to limit to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables (consider using python-dotenv for a .env file)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
MAPBOX_API_KEY = os.environ.get("MAPBOX_API_KEY")

# Ensure API keys are available
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set")
if not MAPBOX_API_KEY:
    raise ValueError("MAPBOX_API_KEY environment variable not set")

# Initialize OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

async def extract_addresses_from_image(image_data: bytes) -> List[str]:
    """
    Extract addresses from an image using OpenAI's Vision API.
    """
    try:
        # Convert image data to base64
        base64_image = base64.b64encode(image_data).decode('utf-8')
        
        # Create vision API request
        response = client.chat.completions.create(
            model="gpt-4o",  # Use a model with vision capabilities
            messages=[
                {
                    "role": "system",
                    "content": "You are a computer vision expert specialized in extracting addresses from images. Extract all addresses from the provided image, separating each address onto a new line. Provide only the list of addresses without any additional text or commentary."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract all addresses from this image."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000
        )
        
        # Extract addresses from text response
        text_content = response.choices[0].message.content
        # Split by newlines and remove empty strings
        addresses = [addr.strip() for addr in text_content.split('\n') if addr.strip()]
        
        return addresses
    
    except Exception as e:
        print(f"Error in extract_addresses_from_image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to extract addresses: {str(e)}")

async def geocode_address(address: str) -> Dict[str, Any]:
    """
    Geocode an address using the Mapbox API.
    """
    try:
        # URL encode the address
        encoded_address = address.replace(' ', '%20')
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{encoded_address}.json?access_token={MAPBOX_API_KEY}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            
            if response.status_code != 200:
                print(f"Geocoding API error: {response.status_code} - {response.text}")
                return {
                    "address": address,
                    "latitude": None,
                    "longitude": None,
                    "error": f"Geocoding failed with status code {response.status_code}"
                }
            
            data = response.json()
            
            # Check if we have any features
            if not data.get("features") or len(data["features"]) == 0:
                return {
                    "address": address,
                    "latitude": None,
                    "longitude": None,
                    "error": "No location found for this address"
                }
            
            # Get the first feature (most relevant match)
            feature = data["features"][0]
            coordinates = feature["geometry"]["coordinates"]
            
            # Mapbox returns coordinates as [longitude, latitude]
            return {
                "address": address,
                "latitude": coordinates[1],
                "longitude": coordinates[0],
                "place_name": feature.get("place_name", "")
            }
    
    except Exception as e:
        print(f"Error in geocode_address: {str(e)}")
        return {
            "address": address,
            "latitude": None,
            "longitude": None,
            "error": str(e)
        }

@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    Process an uploaded image, extract addresses, and geocode them.
    """
    try:
        # Read the image file
        contents = await file.read()
        
        # Extract addresses from the image
        addresses = await extract_addresses_from_image(contents)
        
        if not addresses:
            return {"results": [], "message": "No addresses found in the image"}
        
        # Geocode each address
        geocoded_results = []
        for address in addresses:
            result = await geocode_address(address)
            geocoded_results.append(result)
        
        return {"results": geocoded_results}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "healthy"}