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
  public class ExamController : ControllerBase
  {
    private readonly MongoDbService _mongoDbService;
    private readonly string _collectionName = "Exams";  // Nome da coleção no MongoDB

    // Construtor
    public ExamController(MongoDbService mongoDbService)
    {
      _mongoDbService = mongoDbService; // Injeção do serviço de MongoDB
    }

    // GET: api/Exam
    [HttpGet]
    public ActionResult<List<Exam>> Get()
    {
      // Recupera todos os exames da coleção
      var exams = _mongoDbService.GetCollectionData<Exam>(_collectionName);
      return Ok(exams);
    }

    // GET: api/Exam/5
    [HttpGet("{id}")]
    public ActionResult<Exam> GetById(string id)
    {
      // Filtra pelo Id do exame (usando ObjectId)
      var exam = _mongoDbService.GetDocumentByID<Exam>(_collectionName, new ObjectId(id));

      if (exam == null)
      {
        return NotFound();
      }

      return Ok(exam);
    }

    // POST: api/Exam
    [HttpPost]
    public ActionResult<Exam> Post([FromBody] Exam exam)
    {
      // Insere um novo exame
      _mongoDbService.InsertDocument<Exam>(_collectionName, exam);
      return CreatedAtAction(nameof(GetById), new { id = exam.Id.ToString() }, exam);
    }

    // PUT: api/Exam/5
    [HttpPut("{id}")]
    public ActionResult Put(string id, [FromBody] Exam updatedExam)
    {
      // Converte o ID para ObjectId
      var objectId = new ObjectId(id);

      // Atualiza o exame com os dados completos
      _mongoDbService.UpdateDocument<Exam>(_collectionName, objectId, updatedExam);
      return NoContent();
    }

    // DELETE: api/Exam/5
    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
      // Converte o ID para ObjectId
      var objectId = new ObjectId(id);

      // Deleta o exame
      _mongoDbService.DeleteDocument<Exam>(_collectionName, objectId);
      return NoContent();
    }
  }
}