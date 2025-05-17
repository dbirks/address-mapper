# Vercel Deployment Instructions

This document provides detailed instructions for deploying the Address Mapper application to Vercel.

## Prerequisites

- A Vercel account
- OpenAI API key
- Mapbox API key
- Mapbox public token for frontend mapping

## Deployment Steps

### 1. Connect your GitHub repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Create a new project and import your GitHub repository
3. Select the "Address Mapper" repository

### 2. Configure Environment Variables

The application requires the following environment variables to be set up as secrets in Vercel:

1. Log in to your Vercel dashboard
2. Select the "Address Mapper" project
3. Go to "Settings" → "Environment Variables"
4. Add the following secrets:

| Variable Name | Secret Reference | Value | Description |
|--------------|------------------|-------|-------------|
| OPENAI_API_KEY | openai_api_key | Your OpenAI API key | For OCR and address extraction |
| MAPBOX_API_KEY | mapbox_api_key | Your Mapbox API key | For geocoding addresses |
| VITE_MAPBOX_TOKEN | vite_mapbox_token | Your Mapbox public token | For frontend maps |
| VITE_API_URL | vite_api_url | `/api` | API endpoint path for production |

### 3. Troubleshooting Deployment Issues

If you encounter deployment errors related to missing secrets:

```
Error: Environment Variable "OPENAI_API_KEY" references Secret "openai_api_key", which does not exist.
```

This means you need to add the corresponding secret in the Vercel dashboard.

#### Using Vercel CLI

If you prefer using the CLI, you can add secrets with:

```bash
# Add each secret individually (you'll be prompted for the value)
vercel secrets add openai_api_key
vercel secrets add mapbox_api_key
vercel secrets add vite_mapbox_token
vercel secrets add vite_api_url

# Link secrets to environment variables
vercel env add OPENAI_API_KEY production openai_api_key
vercel env add MAPBOX_API_KEY production mapbox_api_key
vercel env add VITE_MAPBOX_TOKEN production vite_mapbox_token
vercel env add VITE_API_URL production vite_api_url
```

### 4. Deploy

After setting up all required environment variables:

1. Trigger a new deployment in the Vercel dashboard, or
2. Push changes to your GitHub repository, which will trigger an automatic deployment

### 5. Verify Deployment

1. Once deployed, access your application at the provided Vercel URL
2. Test both the frontend UI and the API endpoints
3. Verify that image uploads, OCR, and mapping functionality work correctly