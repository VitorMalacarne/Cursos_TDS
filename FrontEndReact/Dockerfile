# Usar a imagem do Node.js para construir o frontend
FROM node:20 AS build
WORKDIR /app

# Copiar os arquivos do projeto
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Construir a aplicação
RUN npm run build

# Usar um servidor web para servir os arquivos estáticos
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta do frontend
EXPOSE 80

# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]
