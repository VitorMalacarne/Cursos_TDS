using CursosOnline.EFCore.DataContext;
using CursosOnline.Modelo;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

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
app.MapPost("/api/modules", async (CursosOnlineEFCoreContext context, Module modulo) =>
{
    context.Modules.Add(modulo);
    await context.SaveChangesAsync();
    return Results.Created($"/api/modules/{modulo.ModuleID}", modulo);
});
app.MapGet("/api/modules/{id}", async (CursosOnlineEFCoreContext context, int id) =>
{
    var modulo = await context.Modules.FindAsync(id);
    return modulo is not null ? Results.Ok(modulo) : Results.NotFound();
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
    var modulo = await context.Modules.FindAsync(id);

    if (modulo is null)
    {
        return Results.NotFound();
    }

    context.Modules.Remove(modulo);
    await context.SaveChangesAsync();
    return Results.NoContent();
});


app.Run();