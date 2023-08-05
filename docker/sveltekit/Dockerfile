# ビルド用
FROM node:lts-slim as build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY . .

RUN npm run build

# デプロイ用
FROM node:lts-slim

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json .
COPY --from=build /app/node_modules ./node_modules

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
