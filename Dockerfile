# Stage 1: Dependencies Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production Minimal Runtime
FROM node:22-alpine AS runner

# 1. Update OS packages and remove insecure npm/npx binaries
RUN apk update && apk upgrade --no-cache && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# 2. Pre-create the directory and grant ownership to 'node'
WORKDIR /app
RUN chown -R node:node /app

ENV NODE_ENV=production

# 3. Copy application files with explicit node ownership
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node src/ ./src/

# FIX: Static UI साठी public फोल्डर कॉपी करणे
COPY --chown=node:node public/ ./public/

# जर app.js रूट डिरेक्टरीमध्ये असेल तर हे अनकमेंट करा:
# COPY --chown=node:node app.js ./

EXPOSE 3000

USER node
CMD ["node", "src/server.js"]