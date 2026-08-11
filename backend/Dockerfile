# syntax=docker/dockerfile:1

# --- Base image ---------------------------------------------------------
# Pinned to the exact Node version you're running locally, on the slim
# Debian variant to keep the image small while still having a normal libc
# (avoids the native-module build issues Alpine's musl libc sometimes causes
# with packages like bcrypt).
FROM node:24.19.0-slim AS base
WORKDIR /app

# --- Dependencies --------------------------------------------------------
# Copied and installed before the rest of the source so Docker can cache
# this layer — it only re-runs when package.json/package-lock.json change,
# not on every source-code edit.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# --- Runtime ---------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production

# Run as a non-root user rather than the default root.
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home appuser

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
