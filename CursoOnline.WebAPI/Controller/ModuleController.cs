using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using Microsoft.AspNetCore.Mvc;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursoOnline.WebAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ModuleController : ControllerBase
  {
    private readonly MongoDbService _mongoDbService;
    private readonly string _collectionName = "Modules";  // Nome da coleção no MongoDB

    // Construtor
    public ModuleController(MongoDbService mongoDbService)
    {
      _mongoDbService = mongoDbService; // Injeção do serviço de MongoDB
    }

    // GET: api/Module
    [HttpGet]
    public ActionResult<List<Module>> Get()
    {
      // Recupera todos os módulos da coleção
      var modules = _mongoDbService.GetCollectionData<Module>(_collectionName);
      return Ok(modules);
    }

    // GET: api/Module/5
    [HttpGet("{id}")]
    public ActionResult<Module> GetById(string id)
    {
      // Filtra pelo Id do módulo (usando ObjectId)
      var module = _mongoDbService.GetDocumentByID<Module>(_collectionName, new ObjectId(id));

      if (module == null)
      {
        return NotFound();
      }

      return Ok(module);
    }

    // POST: api/Module
    [HttpPost]
    public ActionResult<Module> Post([FromBody] Module module)
    {
      // Insere um novo módulo
      _mongoDbService.InsertDocument<Module>(_collectionName, module);
      return CreatedAtAction(nameof(GetById), new { id = module.ModuleID.ToString() }, module);
    }

    // PUT: api/Module/5
    [HttpPut("{id}")]
    public ActionResult Put(string id, [FromBody] Module updatedModule)
    {
      // Converte o ID para ObjectId
      var objectId = new ObjectId(id);

      // Atualiza o módulo com os dados completos
      _mongoDbService.UpdateDocument<Module>(_collectionName, objectId, updatedModule);
      return NoContent();
    }

    // DELETE: api/Module/5
    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
      // Converte o ID para ObjectId
      var objectId = new ObjectId(id);

      // Deleta o módulo
      _mongoDbService.DeleteDocument<Module>(_collectionName, objectId);
      return NoContent();
    }
  }
}