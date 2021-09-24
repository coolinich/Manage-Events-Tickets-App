FROM node:14
WORKDIR /usr/src/backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "src/server.js"]