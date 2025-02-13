using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModuleController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly string _collectionName = "Modules"; // Nome da coleção no MongoDB

        public ModuleController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        // GET: api/Module
        [HttpGet]
        public IActionResult Get()
        {
            var modules = _mongoDbService.GetCollectionData<Module>(_collectionName);
            return Ok(modules);
        }

        // GET: api/Module/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var module = _mongoDbService.GetDocumentByID<Module>(_collectionName, new ObjectId(id));
            if (module == null)
            {
                return NotFound();
            }
            return Ok(module);
        }

        // POST: api/Module
        [HttpPost]
        public IActionResult Create([FromBody] Module module)
        {
            _mongoDbService.InsertDocument(_collectionName, module);
            return CreatedAtAction(nameof(GetById), new { id = module.Id.ToString() }, module);
        }

        // PUT: api/Module/{id}
        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] Module updatedModule)
        {
            var objectId = new ObjectId(id);
            _mongoDbService.UpdateDocument(_collectionName, objectId, updatedModule);
            return NoContent();
        }

        // DELETE: api/Module/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var objectId = new ObjectId(id);
            _mongoDbService.DeleteDocument<Module>(_collectionName, objectId);
            return NoContent();
        }
    }
}