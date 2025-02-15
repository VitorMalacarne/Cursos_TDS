using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Services;

public class ModuleService
{
    private readonly MongoDbService _mongoDbService;
    private readonly string _modulesCollection = "Modules";
    private readonly string _coursesCollection = "Courses";
    private readonly string _lessonsCollection = "Lessons";
    private readonly string _examsCollection = "Exams";

    public ModuleService(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    // 1. Criar um módulo (verificando lições e exame)
    public bool CreateModule(string teacherId, string courseId, Module module)
    {
        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(courseId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não é o professor criador
        }

        // Verificar se as lições associadas existem
        if (module.LessonsIds != null && module.LessonsIds.Any())
        {
            foreach (var lessonId in module.LessonsIds)
            {
                var lesson = _mongoDbService.GetDocumentByID<Lesson>(_lessonsCollection, new ObjectId(lessonId));
                if (lesson == null)
                {
                    return false; // Uma das lições não existe
                }
            }
        }

        // Verificar se o exame associado existe
        if (!string.IsNullOrEmpty(module.ExamId))
        {
            var exam = _mongoDbService.GetDocumentByID<Exam>(_examsCollection, new ObjectId(module.ExamId));
            if (exam == null)
            {
                return false; // O exame não existe
            }
        }

        // Criar o módulo
        module.Id = ObjectId.GenerateNewId().ToString();
        module.CourseId = courseId;

        _mongoDbService.InsertDocument(_modulesCollection, module);
        return true;
    }

    // 2. Buscar um módulo por ID
    public Module? GetModuleById(string moduleId)
    {
        return _mongoDbService.GetDocumentByID<Module>(_modulesCollection, new ObjectId(moduleId));
    }

    // 3. Buscar todos os módulos de um curso
    public List<Module> GetModulesByCourseId(string courseId)
    {
        return _mongoDbService.GetCollectionData<Module>(_modulesCollection)
            .Where(m => m.CourseId == courseId)
            .ToList();
    }

    // 4. Atualizar um módulo (incluindo lições e exame)
    public bool UpdateModule(string teacherId, string moduleId, Module updatedModule)
    {
        var module = GetModuleById(moduleId);
        if (module == null)
        {
            return false; // Módulo não encontrado
        }

        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(module.CourseId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        // Verificar se as novas lições existem
        if (updatedModule.LessonsIds != null && updatedModule.LessonsIds.Any())
        {
            foreach (var lessonId in updatedModule.LessonsIds)
            {
                var lesson = _mongoDbService.GetDocumentByID<Lesson>(_lessonsCollection, new ObjectId(lessonId));
                if (lesson == null)
                {
                    return false; // Uma das novas lições não existe
                }
            }
        }

        // Verificar se o novo exame existe
        if (!string.IsNullOrEmpty(updatedModule.ExamId))
        {
            var exam = _mongoDbService.GetDocumentByID<Exam>(_examsCollection, new ObjectId(updatedModule.ExamId));
            if (exam == null)
            {
                return false; // O novo exame não existe
            }
        }

        updatedModule.Id = moduleId; // Mantém o mesmo ID do módulo
        updatedModule.CourseId = module.CourseId; // Mantém o curso vinculado

        _mongoDbService.UpdateDocument(_modulesCollection, new ObjectId(moduleId), updatedModule);
        return true;
    }

    // 5. Excluir um módulo
    public bool DeleteModule(string teacherId, string moduleId)
    {
        var module = GetModuleById(moduleId);
        if (module == null)
        {
            return false; // Módulo não encontrado
        }

        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(module.CourseId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        return _mongoDbService.DeleteDocument<Module>(_modulesCollection, new ObjectId(moduleId));
    }
}
