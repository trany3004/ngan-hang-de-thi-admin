FROM node:12.2.0

WORKDIR /app
COPY package.json /app

RUN npm install
COPY . /app
RUN npm install -g @angular/cli

CMD npm start
