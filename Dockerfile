FROM node:20-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY *.js ./
CMD [ "npm", "run", "start-http-mode" ]

