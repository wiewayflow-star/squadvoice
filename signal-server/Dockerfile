FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN mkdir -p /data

ENV PORT=8080
ENV WS_PORT=8081
ENV DB_PATH=/data
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/index.js"]
