#!/bin/bash
# start-infra.sh

echo "Starting infrastructure services..."

# Démarrer les services d'infrastructure
docker-compose -f docker-compose.dev.yml up -d

# Attendre que les services soient prêts
echo "Waiting for services to start..."
sleep 10

# Initialisation du bucket MinIO
echo "Initializing MinIO bucket..."
docker run --rm --network=app-network \
  minio/mc \
  mc config host add myminio http://minio:9000 minio minio123 && \
  mc mb --ignore-existing myminio/car-rental-documents

echo
echo "================================="
echo "Infrastructure services started."
echo "================================="
echo "RabbitMQ UI:    http://localhost:15672 (guest/guest)"
echo "Adminer:        http://localhost:8080"
echo "MinIO API:      http://localhost:9000"
echo "MinIO Console:  http://localhost:9001 (minio/minio123)"
echo "================================="
echo
echo "You can now start your local NestJS services."