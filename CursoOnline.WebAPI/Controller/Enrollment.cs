using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDbConnection;
using CursosOnline.Model;
using System.Collections.Generic;

namespace CursosOnline.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EnrollmentController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;
    private readonly string _collectionName = "Enrollments";

    public EnrollmentController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    [HttpGet]
    public ActionResult<List<Enrollment>> Get()
    {
        var enrollments = _mongoDbService.GetCollectionData<Enrollment>(_collectionName);
        return Ok(enrollments);
    }

    [HttpGet("{id}")]
    public ActionResult<Enrollment> GetById(string id)
    {
        var enrollment = _mongoDbService.GetDocumentByID<Enrollment>(_collectionName, new ObjectId(id));
        if (enrollment == null)
        {
            return NotFound();
        }
        return Ok(enrollment);
    }

    [HttpPost]
    public ActionResult<Enrollment> Post([FromBody] Enrollment enrollment)
    {
        _mongoDbService.InsertDocument<Enrollment>(_collectionName, enrollment);
        return CreatedAtAction(nameof(GetById), new { id = enrollment.Id.ToString() }, enrollment);
    }

    [HttpPut("{id}")]
    public ActionResult Put(string id, [FromBody] Enrollment updatedEnrollment)
    {
        var objectId = new ObjectId(id);
        _mongoDbService.UpdateDocument<Enrollment>(_collectionName, objectId, updatedEnrollment);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
        var objectId = new ObjectId(id);
        _mongoDbService.DeleteDocument<Enrollment>(_collectionName, objectId);
        return NoContent();
    }
}