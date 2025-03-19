#!/bin/bash
# start-services.sh

# Charger les variables d'environnement
if [ -f .env.development.local ]; then
    export $(grep -v '^#' .env.development.local | xargs)
else
    echo "Warning: .env.development.local file not found."
fi

# Vérifier si les services d'infrastructure sont en cours d'exécution
if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up" ; then
    echo "Infrastructure services are not running. Starting them now..."
    ./start-infra.sh
fi

echo "Starting NestJS services in development mode..."

# Démarrer tous les services en parallèle avec concurrently
npx concurrently -n "api,auth,file,email" -c "green,yellow,blue,magenta" \
  "npm run start:dev:api-gateway" \
  "npm run start:dev:auth-service" \
  "npm run start:dev:file-service" \
  "npm run start:dev:email-service"