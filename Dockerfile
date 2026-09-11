# Stage 1: Dependencies Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production Minimal Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# OS package security upgrade
RUN apk update && apk upgrade --no-cache

# Builder स्टेजमधून तयार झालेले node_modules आणि package.json थेट योग्य परवानग्यांसह आणा
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node src/ ./src/

EXPOSE 3000

USER node
CMD ["node", "src/server.js"]