using MongoDbConnection; // Adicione o namespace do seu serviço MongoDbService
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuração de CORS (permite que o frontend Blazor acesse a API)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policyBuilder =>
    {
        policyBuilder.WithOrigins("http://localhost:3000") // URL do frontend Blazor
                     .AllowAnyHeader()
                     .AllowAnyMethod();
    });
});

// Adiciona o Swagger para documentação de API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração do JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"], // Configuração no appsettings.json
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Injeta o serviço para geração de tokens JWT
builder.Services.AddSingleton<JwtService>();

// Conecta ao MongoDB Atlas via MongoDbService (substitui a configuração de DbContext)
var mongoConnectionString = builder.Configuration.GetValue<string>("MongoConnection"); // Pega a string de conexão do MongoDB
var databaseName = builder.Configuration.GetValue<string>("MongoDatabaseName"); // Pega o nome do banco de dados
Console.WriteLine("Toma:" + mongoConnectionString);
builder.Services.AddSingleton<MongoDbService>(serviceProvider =>
{
    return new MongoDbService(mongoConnectionString, databaseName); // Injeta o serviço de MongoDB com conexão configurada
});

// Adiciona os controladores da API
builder.Services.AddControllers();

var app = builder.Build();

// Ativa CORS
app.UseCors();

// Configura autenticação e autorização
app.UseAuthentication();
app.UseAuthorization();

// Configura o Swagger na aplicação
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configura o roteamento da API
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseHttpsRedirection();

app.Run();
