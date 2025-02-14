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
    public class UserController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly string _collectionName = "Users";  // Nome da coleção no MongoDB

        // Construtor
        public UserController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService; // Injeção do serviço de MongoDB
    }

        // GET: api/User
        [HttpGet]
        public ActionResult<List<User>> Get()
        {
            // Recupera todos os usuários da coleção
            var users = _mongoDbService.GetCollectionData<User>(_collectionName);
            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public ActionResult<User> GetById(string id)
        {
            // Filtra pelo Id do usuário (usando ObjectId)
            var user = _mongoDbService.GetDocumentByID<User>(_collectionName, new ObjectId(id));

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        public ActionResult<User> Post([FromBody] User user)
        {
            // Insere um novo usuário
            _mongoDbService.InsertDocument<User>(_collectionName, user);
            return CreatedAtAction(nameof(GetById), new { id = user.Id.ToString() }, user);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] User updatedUser)
        {
            // Converte o ID para ObjectId
            var objectId = new ObjectId(id);

            // Atualiza o usuário com os dados completos
            _mongoDbService.UpdateDocument<User>(_collectionName, objectId, updatedUser);
            return NoContent();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            // Converte o ID para ObjectId
            var objectId = new ObjectId(id);

            // Deleta o usuário
            _mongoDbService.DeleteDocument<User>(_collectionName, objectId);
            return NoContent();
        }
    }
}
