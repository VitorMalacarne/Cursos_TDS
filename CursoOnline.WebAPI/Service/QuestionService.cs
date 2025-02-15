using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Services;

public class QuestionService
{
    private readonly MongoDbService _mongoDbService;
    private readonly string _questionsCollection = "Questions";
    private readonly string _examsCollection = "Exams";
    private readonly string _coursesCollection = "Courses";

    public QuestionService(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    // 1. Criar uma pergunta (apenas professores podem criar)
    public bool CreateQuestion(string teacherId, string examId, Question question)
    {

        if (!ObjectId.TryParse(examId, out ObjectId examObjectId))
        {
            throw new ArgumentException("O ID do exame não é válido.");
        }

        var exam = _mongoDbService.GetDocumentByID<Exam>(_examsCollection, new ObjectId(examId));
        if (exam == null)
        {
            throw new KeyNotFoundException($"Nenhum exame encontrado com o ID {examId}"); // Exame não encontrado
        }

        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(exam.ModuleId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        // Criar pergunta
        question.Id = ObjectId.GenerateNewId().ToString();

        _mongoDbService.InsertDocument(_questionsCollection, question);

        // Adicionar o ID da nova pergunta à lista de perguntas do exame
        exam.QuestionIds.Add(question.Id);
        _mongoDbService.UpdateDocument(_examsCollection, new ObjectId(examId), exam);

        return true;
    }

    // 2. Buscar uma pergunta por ID
    public Question? GetQuestionById(string questionId)
    {
        return _mongoDbService.GetDocumentByID<Question>(_questionsCollection, new ObjectId(questionId));
    }

    // 3. Buscar todas as perguntas de um exame
    public List<Question> GetQuestionsByExamId(string examId)
    {
        var exam = _mongoDbService.GetDocumentByID<Exam>(_examsCollection, new ObjectId(examId));
        if (exam == null)
        {
            return new List<Question>(); // Exame não encontrado
        }

        List<Question> questions = new();
        foreach (var questionId in exam.QuestionIds)
        {
            var question = _mongoDbService.GetDocumentByID<Question>(_questionsCollection, new ObjectId(questionId));
            if (question != null)
            {
                questions.Add(question);
            }
        }

        return questions;
    }

    // 4. Atualizar uma pergunta (apenas professores podem modificar)
    public bool UpdateQuestion(string teacherId, string questionId, Question updatedQuestion)
    {
        var question = GetQuestionById(questionId);
        if (question == null)
        {
            return false; // Pergunta não encontrada
        }

        var exam = _mongoDbService.GetCollectionData<Exam>(_examsCollection)
            .FirstOrDefault(e => e.QuestionIds.Contains(questionId));

        if (exam == null)
        {
            return false; // Exame associado não encontrado
        }

        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(exam.ModuleId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        _mongoDbService.UpdateDocument(_questionsCollection, new ObjectId(questionId), updatedQuestion);
        return true;
    }

    // 5. Excluir uma pergunta (apenas professores podem excluir)
    public bool DeleteQuestion(string teacherId, string questionId)
    {
        var question = GetQuestionById(questionId);
        if (question == null)
        {
            return false; // Pergunta não encontrada
        }

        var exam = _mongoDbService.GetCollectionData<Exam>(_examsCollection)
            .FirstOrDefault(e => e.QuestionIds.Contains(questionId));

        if (exam == null)
        {
            return false; // Exame associado não encontrado
        }

        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(exam.ModuleId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        // Remover a pergunta do exame
        exam.QuestionIds.Remove(questionId);
        _mongoDbService.UpdateDocument(_examsCollection, new ObjectId(exam.Id), exam);

        return _mongoDbService.DeleteDocument<Question>(_questionsCollection, new ObjectId(questionId));
    }
}
