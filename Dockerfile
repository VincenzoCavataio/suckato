FROM node:24.13.0-alpine AS build

WORKDIR /code
COPY package.json package-lock.json ./
COPY . .

RUN npm ci --omit=dev

FROM node:24.13.0-alpine

WORKDIR /code

COPY --from=build --chown=99:100 /code /code

USER 99:100

EXPOSE 3000

CMD [ "node", "src/server.js" ]