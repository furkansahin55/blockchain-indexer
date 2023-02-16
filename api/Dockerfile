FROM node:16-slim

RUN apt-get update

RUN mkdir -p /usr/src/indexer && chown -R node:node /usr/src/indexer

WORKDIR /usr/src/indexer

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .