# Install dependencies only when needed
FROM docker.io/node:lts-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY apps/pp-bot/dist/package*.json ./
COPY libs/db/pickup-point  ./pickup-point-db
RUN npm install --omit=dev && npm install ./pickup-point-db

# Production image, copy all the files and run nest
FROM docker.io/node:lts-alpine AS runner
RUN apk add --no-cache dumb-init
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/pickup-point-db ./pickup-point-db
COPY --from=deps /usr/src/app/package.json ./package.json

COPY apps/pp-bot/dist/ .
RUN chown -R node:node .
USER node
EXPOSE 3000
CMD ["dumb-init", "node", "main.js"]
