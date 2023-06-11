FROM node:18 AS builder

ARG SERVICE
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=@twitch-archiving/api --docker

FROM node:18 AS installer

ARG SERVICE
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json .
RUN npm install

COPY --from=builder /app/out/full/ .
RUN ./node_modules/.bin/turbo build --filter=@twitch-archiving/api

FROM node:18 AS runner

ARG SERVICE
ENV NODE_ENV=production
WORKDIR /app

USER node

COPY --from=installer --chown=node:node /app .

WORKDIR /app/api
CMD node dist/main.js
