using CursosOnline.EFCore.DataContext;
using CursosOnline.Model;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(builder =>
//     {
//         builder.WithOrigins("http://localhost:5071") // URL do frontend Blazor
//                .AllowAnyHeader()
//                .AllowAnyMethod();
//     });
// });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<CursosOnlineEFCoreContext>(options => options.UseSqlite(
    builder.Configuration.GetConnectionString("DefaultConnection")
));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/api/modules", async (CursosOnlineEFCoreContext context) =>
    {
        return await context.Modules.ToListAsync();
    }
);
app.MapPost("/api/modules", async (CursosOnlineEFCoreContext context, Module module) =>
{
    context.Modules.Add(module);
    await context.SaveChangesAsync();
    return Results.Created($"/api/modules/{module.ModuleID}", module);
});
app.MapGet("/api/modules/{id}", async (CursosOnlineEFCoreContext context, int id) =>
{
    var module = await context.Modules.FindAsync(id);
    return module is not null ? Results.Ok(module) : Results.NotFound();
});
app.MapPut("/api/modules/{id}", async (CursosOnlineEFCoreContext context, int id, Module updatedModule) =>
{
    var existingModule = await context.Modules.FindAsync(id);

    if (existingModule is null)
    {
        return Results.NotFound();
    }

    existingModule.Name = updatedModule.Name;
    existingModule.Lessons = updatedModule.Lessons;

    await context.SaveChangesAsync();
    return Results.NoContent();
});
app.MapDelete("/api/modules/{id}", async (CursosOnlineEFCoreContext context, int id) =>
{
    var module = await context.Modules.FindAsync(id);

    if (module is null)
    {
        return Results.NotFound();
    }

    context.Modules.Remove(module);
    await context.SaveChangesAsync();
    return Results.NoContent();
});

//app.UseCors();

app.Run();