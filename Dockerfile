FROM node:20.12.2-alpine3.18


WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

EXPOSE 8080

CMD npm start
