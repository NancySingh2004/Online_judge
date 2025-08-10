FROM node:18-bullseye

RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    gcc g++ \
    ruby \
    bash \
    openjdk-11-jdk-headless \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
