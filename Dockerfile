FROM node:7.5.0-alpine

RUN mkdir -p /usr/app /usr/app/logs && touch /usr/app/logs/emailSchedulerLog
WORKDIR /usr/app

COPY package*.json ./
RUN npm i -q

COPY . ./
CMD ["/usr/app/entrypoint.sh"]
