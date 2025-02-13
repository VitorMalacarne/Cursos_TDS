using MongoDB.Bson;
using Microsoft.AspNetCore.Mvc;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class LessonController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;
    private readonly string _collectionName = "Lessons";

    public LessonController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    // GET: api/Lesson
    [HttpGet]
    public ActionResult<List<Lesson>> GetAll()
    {
        var lessons = _mongoDbService.GetCollectionData<Lesson>(_collectionName);
        return Ok(lessons);
    }

    // GET: api/Lesson/{id}
    [HttpGet("{id}")]
    public ActionResult<Lesson> GetById(string id)
    {
        var lesson = _mongoDbService.GetDocumentByID<Lesson>(_collectionName, new ObjectId(id));

        if (lesson == null)
            return NotFound();

        return Ok(lesson);
    }

    // POST: api/Lesson
    [HttpPost]
    public ActionResult<Lesson> Create([FromBody] Lesson lesson)
    {
        _mongoDbService.InsertDocument<Lesson>(_collectionName, lesson);
        return CreatedAtAction(nameof(GetById), new { id = lesson.Id.ToString() }, lesson);
    }

    // PUT: api/Lesson/{id}
    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] Lesson updatedLesson)
    {
        var objectId = new ObjectId(id);
        _mongoDbService.UpdateDocument<Lesson>(_collectionName, objectId, updatedLesson);
        return NoContent();
    }

    // DELETE: api/Lesson/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteById(string id)
    {
        var objectId = new ObjectId(id);
        _mongoDbService.DeleteDocument<Lesson>(_collectionName, objectId);
        return NoContent();
    }
}
