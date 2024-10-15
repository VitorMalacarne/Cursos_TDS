using CursosOnline.EFCore.DataContext;
using CursosOnline.Modelo;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CursoOnline.WebAPI.Controller;

[Route("api/[controller]")]
[ApiController]
public class AulaController : ControllerBase{
    private readonly CursosOnlineEFCoreContext context;

    public AulaController(CursosOnlineEFCoreContext context)
    {
        this.context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var aulas = await context.Aulas.ToListAsync();
        return Ok(aulas);
    }
    [HttpGet("getByID")]
    public async Task<IActionResult> GetByID(int aulaID) {
        Aula? aula = await context.Aulas.FindAsync(aulaID);
        return Ok(aula);
    }
    [HttpPost]
    public async Task<IActionResult> Create(Aula aula) {
        context.Add(aula);
        await context.SaveChangesAsync();
        return Created("", aula);
    }
    [HttpDelete]
    public async Task<IActionResult> DeleteByID(int aulaID) { 
        Aula? aula = await context.Aulas.FindAsync(aulaID);
        if(aula != null) {
            context.Remove(aula);
            await context.SaveChangesAsync();
            return Ok();
        }

        return NoContent();
    }
    [HttpPut]
    public async Task<IActionResult> Update(Aula aula) {
        context.Entry(aula).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return Ok(aula);
    }

}


