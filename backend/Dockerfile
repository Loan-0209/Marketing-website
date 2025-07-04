FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN mkdir -p uploads && chown -R node:node uploads

USER node

EXPOSE 5000

CMD ["npm", "start"]