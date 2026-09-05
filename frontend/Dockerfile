# Etapa 1: Compilar la SPA con Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir archivos estáticos con Nginx
FROM nginx:alpine
# Copiar el build compilado
COPY --from=build /app/dist /usr/share/nginx/html
# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
