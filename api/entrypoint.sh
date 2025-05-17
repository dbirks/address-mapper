#!/bin/bash
set -e

# Install dependencies directly without virtual environment
echo "Installing dependencies..."
pip install --no-cache-dir -e .
pip install --no-cache-dir uvicorn

# Run the server
echo "Starting server..."
exec uvicorn address_mapper_api.upload_image:app --reload --host 0.0.0.0 --port 8000