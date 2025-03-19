#!/bin/bash
# init-db.sh

echo "Initializing database with seed data..."

# Connecter à PostgreSQL et exécuter le script SQL
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U postgres -d car_rental << EOF
-- Vérifier si la table "users" existe
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            "isEmailVerified" BOOLEAN DEFAULT FALSE,
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
\$\$;

-- Vérifier si la table "files" existe
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'files') THEN
        CREATE TABLE files (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "userId" UUID NOT NULL,
            "originalName" VARCHAR(255) NOT NULL,
            filename VARCHAR(255) NOT NULL,
            "mimeType" VARCHAR(100) NOT NULL,
            size INTEGER NOT NULL,
            "s3Key" VARCHAR(255) NOT NULL,
            "s3Url" VARCHAR(255),
            "uploadedAt" TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
\$\$;

-- Insérer des utilisateurs de test si la table est vide
INSERT INTO users (email, password, "isEmailVerified", "createdAt", "updatedAt")
SELECT 
    'admin@example.com', 
    '\$2b\$10\$3QxDjD1ylgPnRgQLhBrTaOGEHQZU3zYNBw44.AJjxFdLNYnOPmfXm', -- Password123
    TRUE, 
    NOW(), 
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

INSERT INTO users (email, password, "isEmailVerified", "createdAt", "updatedAt")
SELECT 
    'user@example.com', 
    '\$2b\$10\$3QxDjD1ylgPnRgQLhBrTaOGEHQZU3zYNBw44.AJjxFdLNYnOPmfXm', -- Password123
    TRUE, 
    NOW(), 
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@example.com');

-- Afficher les utilisateurs créés
SELECT id, email, "isEmailVerified" FROM users;
EOF

echo "Database initialization completed."