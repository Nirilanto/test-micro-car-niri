# file-service/Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Copier les fichiers package.json et installer les dépendances avec Yarn
COPY package.json yarn.lock ./
RUN yarn install
# Copier les fichiers source
COPY . .

# Compiler l'application
RUN yarn build:file-service

FROM node:20-alpine

WORKDIR /app

# Copier les dépendances et les fichiers de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3002

CMD ["node", "dist/apps/file-service/main"]