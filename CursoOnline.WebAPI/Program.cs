using CursosOnline.EFCore.DataContext;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:5071") // URL do frontend Blazor
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<CursosOnlineEFCoreContext>(options => options.UseSqlite(
    builder.Configuration.GetConnectionString("DefaultConnection")
));
builder.Services.AddControllers();

var app = builder.Build();
app.UseCors();
app.UseRouting();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseEndpoints(endpoints => {
    endpoints.MapControllers();
});

app.UseHttpsRedirection();

app.Run();