#!/bin/bash
# stop-infra.sh

echo "Stopping infrastructure services..."
docker-compose -f docker-compose.dev.yml down

echo "Infrastructure services stopped."