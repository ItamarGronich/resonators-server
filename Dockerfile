FROM node:7.5.0-alpine

RUN mkdir /usr/app
WORKDIR /usr/app

COPY package.json ./
RUN npm i

COPY . ./
CMD ["/bin/sh", "-c", "ENV=dev", "node", "index.js"]
