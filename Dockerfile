FROM node:18.18.2-slim
WORKDIR /app
COPY package.json .
COPY . .
RUN npm install
CMD npm run prod
