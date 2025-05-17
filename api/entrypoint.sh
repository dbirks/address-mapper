#!/bin/bash
set -e

# Create virtual environment directly at each startup
echo "Creating virtual environment..."
python -m venv /app/.venv

# Install dependencies
echo "Installing dependencies..."
. /app/.venv/bin/activate
pip install uv
uv pip install -e .

# Run the server
echo "Starting server..."
exec /app/.venv/bin/uvicorn address_mapper_api.upload_image:app --reload --host 0.0.0.0 --port 8000