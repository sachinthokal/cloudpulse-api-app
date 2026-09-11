# Stage 1: Dependencies Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production Minimal Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 1. OS पॅकेजेस अपडेट करा
RUN apk update && apk upgrade --no-cache

# 2. Trivy ने पकडलेला जुना npm CLI पूर्णपणे काढून टाका
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# 3. Builder मधून node_modules आणि फाइल्स node परवानग्यांसह आणा
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node src/ ./src/

EXPOSE 3000

USER node
CMD ["node", "src/server.js"]