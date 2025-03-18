# email-service/Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier les fichiers source
COPY . .

# Compiler l'application
RUN npm run build email-service

FROM node:20-alpine

WORKDIR /app

# Copier les dépendances et les fichiers de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/email-service/src/templates ./dist/apps/email-service/templates

CMD ["node", "dist/apps/email-service/main"]