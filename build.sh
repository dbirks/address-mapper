#!/bin/bash
# Enhanced build script for Vercel deployment

# Exit on error, but with detailed logging
set -e

echo "==== ADDRESS MAPPER BUILD SCRIPT ===="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Setup frontend
echo "==== FRONTEND BUILD ===="
echo "Entering frontend directory..."
cd ui || { echo "Failed to enter ui directory"; exit 1; }
echo "Current directory: $(pwd)"

echo "Installing npm dependencies..."
npm install || { echo "Failed to install npm dependencies"; exit 1; }

echo "Building frontend..."
npm run build || { echo "Failed to build frontend"; exit 1; }
echo "Frontend build completed successfully!"

# Setup backend
echo "==== BACKEND BUILD ===="
echo "Entering backend directory..."
cd ../api || { echo "Failed to enter api directory"; exit 1; }
echo "Current directory: $(pwd)"

echo "Installing Python dependencies..."
pip install -e . || { echo "Failed to install Python dependencies"; exit 1; }
echo "Backend setup completed successfully!"

echo "==== BUILD COMPLETED SUCCESSFULLY ===="
cd ..
echo "Final build directory structure:"
find ui/dist -type f | sort