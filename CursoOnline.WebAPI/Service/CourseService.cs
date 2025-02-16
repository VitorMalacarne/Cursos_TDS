using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Services;

public class CourseService
{
    private readonly MongoDbService _mongoDbService;
    private readonly string _collectionName = "Courses";
    private readonly string _usersCollection = "Users";

    public CourseService(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    // 📌 1. Criar um curso (apenas professores podem criar cursos)
    public bool CreateCourse(string teacherId, Course course)
    {
        // Verificar se o usuário existe e é um professor
        var teacher = _mongoDbService.GetDocumentByID<User>(_usersCollection, new ObjectId(teacherId));
        if (teacher == null || teacher.Role != "Teacher")
        {
            return false; // Usuário não é um professor ou não existe
        }

        // Criar curso
        course.Id = ObjectId.GenerateNewId().ToString();
        course.InstructorId = teacherId;

        _mongoDbService.InsertDocument(_collectionName, course);
        return true;
    }

    // 📌 2. Buscar curso por ID
    public Course? GetCourseById(string courseId)
    {
        return _mongoDbService.GetDocumentByID<Course>(_collectionName, new ObjectId(courseId));
    }

    // 📌 3. Buscar todos os cursos disponíveis
    public List<Course> GetAllCourses()
    {
        return _mongoDbService.GetCollectionData<Course>(_collectionName);
    }

    // 📌 4. Atualizar informações do curso (apenas o professor que criou pode modificar)
    public bool UpdateCourse(string teacherId, string courseId, Course updatedCourse)
    {
        var course = GetCourseById(courseId);
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não é o professor criador
        }

        updatedCourse.Id = courseId; // Mantém o mesmo ID do curso
        updatedCourse.InstructorId = teacherId; // Mantém o professor como criador

        _mongoDbService.UpdateDocument(_collectionName, new ObjectId(courseId), updatedCourse);
        return true;
    }

    // 📌 5. Excluir um curso (apenas o professor que criou pode excluir)
    public bool DeleteCourse(string teacherId, string courseId)
    {
        var course = GetCourseById(courseId);
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não é o professor criador
        }

        return _mongoDbService.DeleteDocument<Course>(_collectionName, new ObjectId(courseId));
    }

    // 📌 6. Buscar todos os cursos de um professor
    public List<Course> GetCoursesByTeacherId(string teacherId)
    {
        return _mongoDbService.GetCollectionData<Course>(_collectionName)
            .Where(c => c.InstructorId == teacherId)
            .ToList();
    }

    public List<Course> GetCoursesByStudentId(string studentId)
{
    // Usando o operador $elemMatch para buscar cursos que tenham o studentId na lista de estudantes
    var filter = Builders<Course>.Filter.ElemMatch(c => c.Students, s => s.Id == studentId);
    
    // Passando o filtro para o método GetCollectionData
    var courses = _mongoDbService.GetCollectionData<Course>(_collectionName, filter);
    
    return courses;
}
}
