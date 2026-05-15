FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

FROM base AS deps

COPY package.json package-lock.json* ./
RUN [ -f package-lock.json ] && npm ci || npm install

FROM base AS build

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Define build arguments for SvelteKit / Vite
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Set them as environment variables so Vite can see them during build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

RUN npm run build
RUN npm prune --omit=dev

FROM base AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/courses ./courses
COPY --from=build /usr/src/app/problems ./problems
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "build"]
