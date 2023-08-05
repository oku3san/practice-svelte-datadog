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

RUN useradd svelteuser
USER svelteuser

WORKDIR /app

COPY --from=build --chown=svelteuser:svelteuser /app/build ./build
COPY --from=build --chown=svelteuser:svelteuser /app/package.json .
COPY --from=build --chown=svelteuser:svelteuser /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "./build"]