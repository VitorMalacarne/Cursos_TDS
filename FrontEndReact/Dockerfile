# Usar a imagem do Node.js para construir o frontend
FROM node:20 AS build
WORKDIR /app

# Copiar os arquivos do projeto
COPY FrontEndReact/package.json FrontEndReact/package-lock.json ./
RUN npm install

# Copie o restante dos arquivos do frontend (do diretório FrontEndReact)
COPY FrontEndReact/ ./

# Execute o build do React
RUN npm run build

# Use o servidor HTTP para servir os arquivos construídos
FROM nginx:alpine

# Copie o build do React para o Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80

# Inicie o Nginx
CMD ["nginx", "-g", "daemon off;"]
