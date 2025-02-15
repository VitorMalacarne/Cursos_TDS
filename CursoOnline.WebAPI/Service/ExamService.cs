using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Services;

public class ExamService
{
    private readonly MongoDbService _mongoDbService;
    private readonly string _examsCollection = "Exams";
    private readonly string _modulesCollection = "Modules";
    private readonly string _coursesCollection = "Courses";
    private readonly string _questionsCollection = "Questions";
    private readonly string _usersCollection = "Users";

    public ExamService(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    // 1. Criar um exame (apenas professores podem criar)
    public bool CreateExam(string teacherId, string moduleId, Exam exam)
    {
        var module = _mongoDbService.GetDocumentByID<Module>(_modulesCollection, new ObjectId(moduleId));
        if (module == null)
        {
            return false; // Módulo não encontrado
        }

        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(module.CourseId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        // Criar exame
        exam.Id = ObjectId.GenerateNewId().ToString();
        exam.ModuleId = moduleId;
        exam.QuestionIds = new List<string>(); // Inicializa a lista de perguntas como vazia

        _mongoDbService.InsertDocument(_examsCollection, exam);

        // Atualizar o módulo com o ID do exame
        module.ExamId = exam.Id;
        _mongoDbService.UpdateDocument(_modulesCollection, new ObjectId(moduleId), module);

        return true;
    }

    // 2. Buscar um exame por ID
    public Exam? GetExamById(string examId)
    {
        return _mongoDbService.GetDocumentByID<Exam>(_examsCollection, new ObjectId(examId));
    }

    // 3. Buscar exames de um módulo
    public List<Exam> GetExamsByModuleId(string moduleId)
    {
        return _mongoDbService.GetCollectionData<Exam>(_examsCollection)
            .Where(e => e.ModuleId == moduleId)
            .ToList();
    }

    // 4. Adicionar uma pergunta ao exame (somente professores)
    public bool AddQuestionToExam(string teacherId, string examId, Question question)
    {
        var exam = GetExamById(examId);
        if (exam == null)
        {
            return false; // Exame não encontrado
        }

        var module = _mongoDbService.GetDocumentByID<Module>(_modulesCollection, new ObjectId(exam.ModuleId));
        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(module.CourseId));

        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        // Criar a pergunta no banco
        question.Id = ObjectId.GenerateNewId().ToString();
        _mongoDbService.InsertDocument(_questionsCollection, question);

        // Adicionar a pergunta ao exame
        exam.QuestionIds.Add(question.Id);
        _mongoDbService.UpdateDocument(_examsCollection, new ObjectId(examId), exam);

        return true;
    }

    // 5. Atualizar um exame (apenas professores podem modificar)
    public bool UpdateExam(string teacherId, string examId, Exam updatedExam)
    {
        var exam = GetExamById(examId);
        if (exam == null)
        {
            return false; // Exame não encontrado
        }

        var module = _mongoDbService.GetDocumentByID<Module>(_modulesCollection, new ObjectId(exam.ModuleId));
        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(module.CourseId));

        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        updatedExam.Id = examId; // Mantém o mesmo ID do exame
        updatedExam.ModuleId = exam.ModuleId; // Mantém o módulo vinculado

        _mongoDbService.UpdateDocument(_examsCollection, new ObjectId(examId), updatedExam);
        return true;
    }

    // 6. Excluir um exame (apenas professores podem excluir)
    public bool DeleteExam(string teacherId, string examId)
    {
        var exam = GetExamById(examId);
        if (exam == null)
        {
            return false; // Exame não encontrado
        }

        var module = _mongoDbService.GetDocumentByID<Module>(_modulesCollection, new ObjectId(exam.ModuleId));
        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(module.CourseId));

        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        return _mongoDbService.DeleteDocument<Exam>(_examsCollection, new ObjectId(examId));
    }

    // 7. Submeter uma resposta ao exame
    public int GradeExam(string studentId, string examId, List<int> userAnswers)
    {
        var exam = GetExamById(examId);
        if (exam == null || exam.QuestionIds.Count == 0)
        {
            return -1; // Exame não encontrado ou sem perguntas
        }

        var student = _mongoDbService.GetDocumentByID<User>(_usersCollection, new ObjectId(studentId));
        if (student == null || student.Role != "Student")
        {
            return -1; // Usuário não encontrado ou não é aluno
        }

        // Buscar todas as perguntas no banco de dados
        List<Question> questions = new();
        foreach (var questionId in exam.QuestionIds)
        {
            var question = _mongoDbService.GetDocumentByID<Question>(_questionsCollection, new ObjectId(questionId));
            if (question != null)
            {
                questions.Add(question);
            }
        }

        // Verificar se o número de respostas corresponde ao número de perguntas
        if (userAnswers.Count != questions.Count)
        {
            return -1; // Retorna erro se o número de respostas for diferente do esperado
        }

        // Calcular a pontuação do aluno
        int score = 0;
        for (int i = 0; i < questions.Count; i++)
        {
            if (questions[i].CheckAnswer(userAnswers[i]))
            {
                score++;
            }
        }

        return score;
    }
}
