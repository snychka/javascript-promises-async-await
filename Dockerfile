FROM node:8.12-alpine

WORKDIR /src/

ADD ./package.json .

RUN ["npm", "install"]

COPY . .

RUN chown -R node:node /src

USER node
