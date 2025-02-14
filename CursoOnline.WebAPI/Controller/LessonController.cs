using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class LessonController : ControllerBase
  {
    private readonly MongoDbService _mongoDbService;
    private readonly string _collectionName = "Lessons";  // Nome da coleção no MongoDB

    // Construtor
    public LessonController(MongoDbService mongoDbService)
    {
      _mongoDbService = mongoDbService; // Injeção do serviço de MongoDB
    }

    // GET: api/Lesson
    [HttpGet]
    public ActionResult<List<Lesson>> Get()
    {
      // Recupera todas as lições da coleção
      var lessons = _mongoDbService.GetCollectionData<Lesson>(_collectionName);
      return Ok(lessons);
    }

    // GET: api/Lesson/5
    [HttpGet("{id}")]
    public ActionResult<Lesson> GetById(string id)
    {
      // Filtra pelo Id da lição (usando ObjectId)
      var lesson = _mongoDbService.GetDocumentByID<Lesson>(_collectionName, new ObjectId(id));

      if (lesson == null)
      {
        return NotFound();
      }

      return Ok(lesson);
    }

    // POST: api/Lesson
    [HttpPost]
    public ActionResult<Lesson> Post([FromBody] Lesson lesson)
    {
      // Insere uma nova lição
      _mongoDbService.InsertDocument<Lesson>(_collectionName, lesson);
      return CreatedAtAction(nameof(GetById), new { id = lesson.LessonID.ToString() }, lesson);
    }

    // PUT: api/Lesson/5
    [HttpPut("{id}")]
    public ActionResult Put(string id, [FromBody] Lesson updatedLesson)
    {
      // Converte o ID para ObjectId
      var objectId = new ObjectId(id);

      // Atualiza a lição com os dados completos
      _mongoDbService.UpdateDocument<Lesson>(_collectionName, objectId, updatedLesson);
      return NoContent();
    }

    // DELETE: api/Lesson/5
    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
      // Converte o ID para ObjectId
      var objectId = new ObjectId(id);

      // Deleta a lição
      _mongoDbService.DeleteDocument<Lesson>(_collectionName, objectId);
      return NoContent();
    }
  }
}


