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
  public class QuestionController : ControllerBase
  {
    private readonly MongoDbService _mongoDbService;
    private readonly string _collectionName = "Questions";  // Nome da coleção no MongoDB

    // Construtor
    public QuestionController(MongoDbService mongoDbService)
    {
      _mongoDbService = mongoDbService; // Injeção do serviço de MongoDB
    }

    // GET: api/Question
    [HttpGet]
    public ActionResult<List<Question>> Get()
    {
      // Recupera todas as questões da coleção
      var questions = _mongoDbService.GetCollectionData<Question>(_collectionName);
      return Ok(questions);
    }

    // GET: api/Question/5
    [HttpGet("{id}")]
    public ActionResult<Question> GetById(string id)
    {
      // Filtra pelo Id da questão (usando ObjectId)
      var question = _mongoDbService.GetDocumentByID<Question>(_collectionName, new ObjectId(id));

      if (question == null)
      {
        return NotFound();
      }

      return Ok(question);
    }

    // POST: api/Question
    [HttpPost]
    public ActionResult<Question> Post([FromBody] Question question)
    {
      // Insere uma nova questão
      _mongoDbService.InsertDocument<Question>(_collectionName, question);
      return CreatedAtAction(nameof(GetById), new { id = question.QuestionID.ToString() }, question);
    }

    // PUT: api/Question/5
    [HttpPut("{id}")]
    public ActionResult Put(string id, [FromBody] Question updatedQuestion)
    {
      // Converte o ID para ObjectId
      var objectId = new ObjectId(id);

      // Atualiza a questão com os dados completos
      _mongoDbService.UpdateDocument<Question>(_collectionName, objectId, updatedQuestion);
      return NoContent();
    }

    // DELETE: api/Question/5
    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
      // Converte o ID para ObjectId
      var objectId = new ObjectId(id);

      // Deleta a questão
      _mongoDbService.DeleteDocument<Question>(_collectionName, objectId);
      return NoContent();
    }
  }
}