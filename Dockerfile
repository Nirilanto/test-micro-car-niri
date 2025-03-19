# Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# Construire tous les services
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Copier les dépendances et les fichiers de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Copier les templates d'email pour le service d'email
COPY --from=builder /app/apps/email-service/src/templates ./dist/apps/email-service/templates

# Exposer les ports
EXPOSE 3007 3001 3002

# Le CMD sera défini au niveau du service dans docker-compose.yml
CMD ["node", "dist/apps/api-gateway/main"]