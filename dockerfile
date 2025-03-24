FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

RUN npm install --save-dev @types/react-slick --legacy-peer-deps

COPY . .

RUN npm run build --legendary-peer-deps

EXPOSE 8055

CMD ["npm", "run", "dev"]