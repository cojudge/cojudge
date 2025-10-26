# Dev-only Dockerfile for running the SvelteKit app with Vite on port 3000
# No production build; runs `npm run dev` inside the container.

FROM node:20-alpine

# Install dependencies required by some native modules if needed (kept minimal)
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
# If there's a lockfile, prefer `npm ci`; otherwise fall back to `npm install`
RUN [ -f package-lock.json ] && npm ci || npm install

# Copy the rest of the source
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Ensure Vite binds to all interfaces and uses port 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

