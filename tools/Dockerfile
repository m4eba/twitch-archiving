ARG SERVICE=tools
FROM node:21.5.0-bullseye AS base

FROM base AS builder

ARG SERVICE
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=@twitch-archiving/${SERVICE} --docker

FROM base AS installer

ARG SERVICE
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json .
RUN npm install

COPY --from=builder /app/out/full/ .
RUN ./node_modules/.bin/turbo build --filter=@twitch-archiving/${SERVICE}

FROM base AS runner

ARG SERVICE
ENV NODE_ENV=production
WORKDIR /app

RUN apt update
RUN apt install -y ffmpeg
RUN apt install -y gifsicle
RUN apt install -y imagemagick
RUN apt install -y nfs-common

USER node

COPY --from=installer --chown=node:node /app .

ENV MAIN_FILE=tools/dist/index.js
ENTRYPOINT [ "node", ${MAIN_FILE} ]
