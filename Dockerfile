# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Production Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# OS package upgrade (libcrypto3 / libssl3 patch fixed)
RUN apk update && apk upgrade --no-cache

# package.json node
COPY --chown=node:node package*.json ./

# prod lib installation
RUN npm ci --only=production \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --chown=node:node src/ ./src/

EXPOSE 3000

USER node
CMD ["node", "src/server.js"]