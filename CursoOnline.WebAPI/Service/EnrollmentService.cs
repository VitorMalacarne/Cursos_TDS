using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Services;

public class EnrollmentService
{
    private readonly MongoDbService _mongoDbService;
    private readonly string _collectionName = "Enrollments";
    private readonly string _usersCollection = "Users";
    private readonly string _coursesCollection = "Courses";

    public EnrollmentService(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    // 1. Criar matrícula
    public bool EnrollStudent(string userId, string courseId)
    {

        if (!ObjectId.TryParse(userId, out ObjectId studentObjectId))
        {
            throw new ArgumentException("O ID do estudante não é um ObjectId válido.");
        }

        if (!ObjectId.TryParse(courseId, out ObjectId courseObjectId))
        {
            throw new ArgumentException("O ID do curso não é um ObjectId válido.");
        }

        // Verificar se o curso existe
        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(courseId));
        if (course == null)
        {
            return false; // Curso não encontrado
        }

        // Verificar se o aluno existe
        var student = _mongoDbService.GetDocumentByID<User>(_usersCollection, new ObjectId(userId));
        if (student == null || student.Role != "Student")
        {
            return false; // Usuário não existe ou não é um aluno
        }

        // Verificar se o aluno já está matriculado
        var existingEnrollment = _mongoDbService.GetCollectionData<Enrollment>(_collectionName)
            .FirstOrDefault(e => e.StudentId == userId && e.CourseId == courseId);
        if (existingEnrollment != null)
        {
            return false; // Matrícula já existe
        }

        // Criar a matrícula
        var enrollment = new Enrollment
        {
            Id = ObjectId.GenerateNewId().ToString(),
            StudentId = userId,
            CourseId = courseId,
            EnrollmentDate = DateTime.UtcNow,
            Progress = 0
        };

        _mongoDbService.InsertDocument(_collectionName, enrollment);
        return true;
    }

    // 2. Buscar matrícula por ID
    public Enrollment? GetEnrollmentById(string enrollmentId)
    {
        return _mongoDbService.GetDocumentByID<Enrollment>(_collectionName, new ObjectId(enrollmentId));
    }

    // 3. Buscar todas as matrículas de um usuário
    public List<Enrollment> GetEnrollmentsByUserId(string userId)
    {
        return _mongoDbService.GetCollectionData<Enrollment>(_collectionName)
            .Where(e => e.StudentId == userId)
            .ToList();
    }

    // 4. Buscar todas as matrículas de um curso
    public List<Enrollment> GetEnrollmentsByCourseId(string courseId)
    {
        return _mongoDbService.GetCollectionData<Enrollment>(_collectionName)
            .Where(e => e.CourseId == courseId)
            .ToList();
    }

    // 5. Atualizar progresso do aluno
    public bool UpdateProgress(string enrollmentId, int newProgress)
    {
        var enrollment = GetEnrollmentById(enrollmentId);
        if (enrollment == null || newProgress < 0 || newProgress > 100)
        {
            return false; // Matrícula não encontrada ou progresso inválido
        }

        enrollment.Progress = newProgress;
        _mongoDbService.UpdateDocument(_collectionName, new ObjectId(enrollmentId), enrollment);
        return true;
    }

    // 6. Cancelar matrícula
    public bool CancelEnrollment(string enrollmentId)
    {
        return _mongoDbService.DeleteDocument<Enrollment>(_collectionName, new ObjectId(enrollmentId));
    }
}
