using MongoDbConnection; // Adicione o namespace do seu serviço MongoDbService
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CursosOnline.Services;
using Microsoft.OpenApi.Models;

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
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cursos Online API", Version = "v1" });

    // 🔹 Configuração do botão "Authorize" no Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT no formato: Bearer {seu_token_aqui}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

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


builder.Services.AddSingleton<JwtService>();          // Injeta o serviço para geração de tokens JWT
builder.Services.AddSingleton<UserService>();         // Gerenciamento de usuários
builder.Services.AddSingleton<EnrollmentService>();   // Gerenciamento de matrículas
builder.Services.AddSingleton<CourseService>();       // Gerenciamento de cursos
builder.Services.AddSingleton<ModuleService>();       // Gerenciamento de módulos
builder.Services.AddSingleton<LessonService>();       // Gerenciamento de liçoes
builder.Services.AddSingleton<ExamService>();         // Gerenciamento de exames
builder.Services.AddSingleton<QuestionService>();     // Gerenciamento de questões





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

// Configura o roteamento da API
app.UseRouting();
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


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseHttpsRedirection();

app.Run();
