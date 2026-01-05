FROM node:22.21.1-trixie-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3333

CMD [ "npm", "start" ]