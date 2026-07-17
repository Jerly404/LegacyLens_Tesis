FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/
RUN npm install
COPY . .
RUN npm run build:shared
RUN npm run build:frontend

FROM nginx:alpine
COPY --from=builder /app/frontend/dist/frontend/browser /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
