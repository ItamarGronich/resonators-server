FROM node:7.5.0

RUN apt-get update && apt-get upgrade -y --no-install-recommends

# Define source code root path.
ENV SOURCE_ROOT /opt/resontaors/src

RUN mkdir -p $SOURCE_ROOT

WORKDIR $SOURCE_ROOT

COPY package.json $SOURCE_ROOT
COPY package-lock.json $SOURCE_ROOT

RUN NPM_CONFIG_LOGLEVEL=notice npm i

COPY . $SOURCE_ROOT

CMD bash -c "ENV=dev node index.js"