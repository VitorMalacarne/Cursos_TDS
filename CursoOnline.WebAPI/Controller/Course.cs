using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly string _collectionName = "Courses";

        public CourseController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        [HttpGet]
        public ActionResult<List<Course>> Get()
        {
            var courses = _mongoDbService.GetCollectionData<Course>(_collectionName);
            return Ok(courses);
        }

        [HttpGet("{id}")]
        public ActionResult<Course> GetById(string id)
        {
            var course = _mongoDbService.GetDocumentByID<Course>(_collectionName, new ObjectId(id));
            if (course == null)
            {
                return NotFound();
            }
            return Ok(course);
        }

        [HttpPost]
        public ActionResult<Course> Post([FromBody] Course course)
        {
            _mongoDbService.InsertDocument<Course>(_collectionName, course);
            return CreatedAtAction(nameof(GetById), new { id = course.Id.ToString() }, course);
        }

        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Course updatedCourse)
        {
            var objectId = new ObjectId(id);
            _mongoDbService.UpdateDocument<Course>(_collectionName, objectId, updatedCourse);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var objectId = new ObjectId(id);
            _mongoDbService.DeleteDocument<Course>(_collectionName, objectId);
            return NoContent();
        }
    }
}
