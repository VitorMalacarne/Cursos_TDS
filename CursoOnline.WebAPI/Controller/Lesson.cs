using CursosOnline.EFCore.DataContext;
using CursosOnline.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CursoOnline.WebAPI.Controller;

[Route("api/[controller]")]
[ApiController]
public class LessonController : ControllerBase{
    private readonly CursosOnlineEFCoreContext context;

    public LessonController(CursosOnlineEFCoreContext context)
    {
        this.context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var lessons = await context.Lessons.ToListAsync();
        return Ok(lessons);
    }
    [HttpGet("{lessonID}")]
    public async Task<IActionResult> GetByID(int lessonID) {
        Lesson? lesson = await context.Lessons.FindAsync(lessonID);
        return Ok(lesson);
    }
    [HttpPost]
    public async Task<IActionResult> Create(Lesson lesson) {
        context.Add(lesson);
        await context.SaveChangesAsync();
        return Created("", lesson);
    }
    [HttpDelete("{lessonID}")]
    public async Task<IActionResult> DeleteByID(int lessonID) { 
        Lesson? lesson = await context.Lessons.FindAsync(lessonID);
        if(lesson != null) {
            context.Remove(lesson);
            await context.SaveChangesAsync();
            return Ok();
        }

        return NoContent();
    }
    [HttpPut("{lessonID}")]
    public async Task<IActionResult> Update(Lesson lesson) {
        context.Entry(lesson).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return Ok(lesson);
    }

}


