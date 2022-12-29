FROM node:16 AS builder

WORKDIR /app
RUN mkdir /app-build

RUN npm install -g @microsoft/rush

COPY . .

RUN rush install
RUN rush build
RUN rush deploy --project @twitch-stats/missing --target-folder /app-build

FROM node:16

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app-build .

CMD node bot/missing/dist/index.js
