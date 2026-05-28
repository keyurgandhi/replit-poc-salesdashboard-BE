FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY src ./src
COPY build.mjs tsconfig.json drizzle.config.ts ./

RUN node build.mjs

FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
