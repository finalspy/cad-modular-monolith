#!/bin/bash

# Create the data directory if it doesn't exist
mkdir -p ./data

# Run the MongoDB Docker container
docker run -d \
  --rm \
  --name mongodb-monolithic-app \
  -p 27017:27017 \
  -v "$(pwd)/data:/data/db" \
  -e MONGO_INITDB_DATABASE=monolithic-app \
  mongo:latest

echo "MongoDB is running on localhost:27017"