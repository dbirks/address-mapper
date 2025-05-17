# Address Mapper

A full-stack application that extracts addresses from images and maps them using OpenAI OCR and Mapbox.

## Features

- Upload images containing addresses
- Extract addresses using OpenAI's GPT-4o model
- Geocode addresses to get latitude/longitude coordinates
- Display addresses on an interactive map
- Mobile-responsive UI with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend

- React with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- shadcn/ui components
- Mapbox GL for interactive maps

### Backend

- FastAPI for the API endpoints
- OpenAI API for OCR (text extraction from images)
- Mapbox Geocoding API
- Python with uv for package management

## Setup Instructions

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.9+
- OpenAI API key
- Mapbox API key
- Docker and Docker Compose (optional, for containerized development)

### Environment Variables

Create a `.env` file in the project root with:

```
# OpenAI API key for OCR
OPENAI_API_KEY=your_openai_api_key_here

# Mapbox API key for geocoding
MAPBOX_API_KEY=your_mapbox_api_key_here
```

For the frontend, create a `.env` file in the `frontend` directory with:

```
# API URL for development
VITE_API_URL=http://localhost:8000

# Mapbox public token (not a secret)
VITE_MAPBOX_TOKEN=your_mapbox_public_token_here
```

### Development Setup

#### Option 1: Using Docker Compose

```bash
# Start both frontend and backend services
docker-compose up
```

#### Option 2: Manual Setup

**Backend:**

```bash
# Navigate to the API directory
cd api

# Create a virtual environment and install dependencies
uv venv
source .venv/bin/activate
uv pip install -e .

# Start the FastAPI server
uvicorn address_mapper_api.upload_image:app --reload
```

**Frontend:**

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The frontend will be available at http://localhost:5173 and the API at http://localhost:8000.

## Deployment

### Deploying to Vercel

This project is configured for deployment on Vercel using the provided `vercel.json` configuration. The configuration handles both the frontend React application and the FastAPI backend.

1. **Connect your GitHub repository to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Create a new project and import your GitHub repository
   - Select the "Address Mapper" repository

2. **Configure Environment Variables**
   - Add the following environment variables in the Vercel dashboard:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `MAPBOX_API_KEY`: Your Mapbox API key for geocoding
     - `VITE_MAPBOX_TOKEN`: Your public Mapbox GL JS token
     - `VITE_API_URL`: Set to `/api` for production deployment

3. **Deploy**
   - Click "Deploy" to start the deployment process
   - Vercel will automatically:
     - Install dependencies for both frontend and backend
     - Build the React frontend with Vite
     - Set up the FastAPI backend with Python
     - Configure routing for API requests

4. **Verify Deployment**
   - Once deployed, you can access your application at the provided Vercel URL
   - Test both the frontend UI and the API endpoints

### Troubleshooting Deployment

If you encounter issues with the deployment:

1. **Check build logs** in the Vercel dashboard for errors
2. **Verify environment variables** are correctly set
3. **Test the build locally** using the provided build script:
   ```bash
   ./build.sh
   ```
4. **Check API routing** by accessing `/api/health` endpoint

## License

MIT
# Create a .env file with your API keys
cp .env.example .env
# Then edit the .env file with your actual API keys
