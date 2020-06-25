FROM node:12.18

WORKDIR /usr/src/app

#COPY ./package.json ./
COPY ./ .

RUN npm install --save core-js@^3
RUN npm install

EXPOSE 3000

CMD [ "node", "server.js" ]
