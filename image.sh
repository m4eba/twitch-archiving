#!/bin/bash

VERSION=`git describe --tags --abbrev=0`
REF=`git rev-parse HEAD`
DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
echo $VERSION 
echo $REF 
echo $DATE

build_image() {
  docker buildx build --file ./$1/Dockerfile \
  --label org.opencontainers.image.title=twitch-archiving \
  --label org.opencontainers.image.description= \
  --label org.opencontainers.image.source=https://github.com/m4eba/twitch-archiving \
  --label org.opencontainers.image.url=https://github.com/m4eba/twitch-archiving \
  --label org.opencontainers.image.revision=$REF \
  --label org.opencontainers.image.version=$VERSION \
  --label org.opencontainers.image.created=$DATE \
  --platform linux/amd64 \
  --tag ghcr.io/m4eba/twitch-archiving-$2:latest \
  --tag ghcr.io/m4eba/twitch-archiving-$2:$VERSION \
  --push .
}


build_image api api

