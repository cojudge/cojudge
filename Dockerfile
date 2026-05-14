FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

FROM base AS deps

COPY package.json package-lock.json* ./
RUN [ -f package-lock.json ] && npm ci || npm install

FROM deps AS build

COPY . .
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
