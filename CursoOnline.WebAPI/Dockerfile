# Usar a imagem base do .NET SDK para compilar a aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar arquivos e restaurar dependências
COPY *.sln ./
COPY CursoOnline.WebAPI/CursosOnline.WebAPI.csproj CursoOnline.WebAPI/
COPY CursosOnline/CursosOnline.Model.csproj CursosOnline/
COPY CursosOnline.MongoDB/CursosOnline.MongoDB.csproj CursosOnline.MongoDB/

# Remover cache do NuGet antes da restauração
RUN dotnet nuget locals all --clear
RUN dotnet restore CursoOnline.WebAPI/CursosOnline.WebAPI.csproj

# Copiar o código-fonte e compilar a API
COPY . .
RUN dotnet publish CursoOnline.WebAPI/CursosOnline.WebAPI.csproj -c Release -o /out

# Usar a imagem base do .NET Runtime para rodar a API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Expor a porta da API
EXPOSE 5000

# Comando de inicialização do container
ENTRYPOINT ["dotnet", "CursosOnline.WebAPI.dll"]
