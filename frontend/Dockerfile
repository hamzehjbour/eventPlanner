# syntax=docker/dockerfile:1

# --- Build stage -----------------------------------------------------------
# Vite's dev server / `npm run preview` aren't meant for production traffic,
# so we build static assets here and hand them off to nginx below instead of
# running `vite preview` as the container's actual server.
FROM node:24.19.0-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines import.meta.env.* values at build time, so this has to be
# passed in as a build ARG (not a runtime environment variable) and
# exported as ENV so the `vite build` process below can actually read it.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build
# Output lands in /app/dist (Vite's default build.outDir)

# --- Serve stage -------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# SPA fallback config: any path nginx can't find as a static file falls back
# to index.html, so vue-router's history mode (client-side routes like
# /events/123) works on a hard refresh instead of 404ing.
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
