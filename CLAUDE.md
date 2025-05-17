# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Address Mapper is a full-stack application that extracts addresses from images and plots them on a map. It uses OpenAI's GPT-4o model for OCR to extract addresses from uploaded images, Mapbox's API for geocoding and mapping, and is built with a FastAPI backend and React frontend.

## Development Environment Setup

### Backend (FastAPI)

```bash
# Navigate to the API directory
cd api

# Install dependencies 
uv pip install -e .

# Run the development server
uvicorn address_mapper_api.upload_image:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React/Vite)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

### Docker Compose

For containerized development of both frontend and backend:

```bash
# Start both services
docker-compose up

# Rebuild containers after dependency changes
docker-compose up --build
```

## Environment Variables

The application requires the following environment variables:

### Backend (API)
- `OPENAI_API_KEY`: API key for OpenAI services (for OCR)
- `MAPBOX_API_KEY`: API key for Mapbox geocoding

### Frontend
- `VITE_API_URL`: URL for the backend API (default: http://localhost:8000 for development)
- `VITE_MAPBOX_TOKEN`: Public token for Mapbox GL JS

## Project Architecture

### Directory Structure

- `/api`: FastAPI backend
  - `/src/address_mapper_api`: Python package for the API
    - `upload_image.py`: Main FastAPI app with image upload endpoint
- `/frontend`: React/TypeScript frontend
  - `/src/components`: React components
    - `image-upload.tsx`: Component for uploading and processing images
    - `address-map.tsx`: Mapbox GL integration for displaying addresses

### Data Flow

1. User uploads an image via the frontend's `ImageUpload` component
2. Image is sent to the FastAPI backend's `/api/upload-image` endpoint
3. Backend extracts text from the image using OpenAI's GPT-4o model
4. Extracted addresses are geocoded using Mapbox's API
5. Geocoded addresses with coordinates are returned to the frontend
6. `AddressMap` component displays the addresses as markers on a Mapbox map

### Key APIs

#### Backend
- `POST /api/upload-image`: Accepts a multipart form with an image file, extracts addresses, and returns geocoded results
- `GET /api/health`: Simple health check endpoint

#### Frontend
- `ImageUpload`: Handles image file selection and API calls
- `AddressMap`: Displays geocoded addresses on a Mapbox map

## Deployment

The application is configured for deployment on Vercel using the `vercel.json` configuration file.