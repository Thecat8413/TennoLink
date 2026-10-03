# Warframe Squad Relic Sync & Mastery Engine - Dockerfile
# Base: Node 22 Alpine (Zero-dependency, native node:sqlite and Web Crypto)
FROM node:22-alpine

WORKDIR /app

# Set production environment defaults
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    DATA_DIR=/app/data

# Copy project files
COPY . .

# Create persistent data volume mount point
RUN mkdir -p /app/data

EXPOSE 3000

# Mountable volume for long-term SQLite database persistence
VOLUME ["/app/data"]

# Healthcheck for Docker Compose & Reverse Proxies
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server/index.js"]
