# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# Only Install Prod dependencies (No dev dependencies added)
RUN npm ci --only=production && npm cache clean --force

COPY src/ ./src/

EXPOSE 3000

USER node
CMD ["node", "src/server.js"]