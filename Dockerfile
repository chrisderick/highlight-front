FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/highlight-front/browser ./
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
