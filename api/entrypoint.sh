#!/bin/bash
set -e

# Create virtual environment if it doesn't exist
if [ ! -d "/app/.venv" ]; then
  echo "Creating virtual environment..."
  uv venv /app/.venv
fi

# Install dependencies
echo "Installing dependencies..."
. /app/.venv/bin/activate
uv pip install -e .

# Run the server
echo "Starting server..."
exec /app/.venv/bin/uvicorn address_mapper_api.upload_image:app --reload --host 0.0.0.0 --port 8000