# Usar a imagem base do .NET Runtime para rodar a API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Usar a imagem base do .NET SDK para compilar a aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["CursoOnline.WebAPI/CursosOnline.WebAPI.csproj", "CursoOnline.WebAPI/"]
COPY ["CursosOnline/CursosOnline.Model.csproj", "CursosOnline/"]
COPY ["CursosOnline.MongoDB/CursosOnline.MongoDB.csproj", "CursosOnline.MongoDB/"]
RUN dotnet restore "CursoOnline.WebAPI/CursosOnline.WebAPI.csproj"
COPY . .
WORKDIR "/src/CursoOnline.WebAPI"
RUN dotnet build "CursosOnline.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "CursosOnline.WebAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CursosOnline.WebAPI.dll"]
