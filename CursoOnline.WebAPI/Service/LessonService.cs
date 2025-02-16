using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Services;

public class LessonService
{
    private readonly MongoDbService _mongoDbService;
    private readonly string _lessonsCollection = "Lessons";
    private readonly string _modulesCollection = "Modules";
    private readonly string _coursesCollection = "Courses";

    public LessonService(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    public List<Lesson> GetAllLessons()
    {
        return _mongoDbService.GetCollectionData<Lesson>(_lessonsCollection);
    }

    // 📌 1. Criar uma lição (apenas professores podem criar)
    public bool CreateLesson(string teacherId, string moduleId, Lesson lesson)
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

        // Criar lição
        lesson.Id = ObjectId.GenerateNewId().ToString();
        lesson.ModuleId = moduleId;

        _mongoDbService.InsertDocument(_lessonsCollection, lesson);

        // Adicionar o ID da nova lição à lista de lições do módulo
        module.LessonsIds.Add(lesson.Id);
        _mongoDbService.UpdateDocument(_modulesCollection, new ObjectId(moduleId), module);

        return true;
    }

    // 📌 2. Buscar uma lição por ID
    public Lesson? GetLessonById(string lessonId)
    {
        return _mongoDbService.GetDocumentByID<Lesson>(_lessonsCollection, new ObjectId(lessonId));
    }

    // 📌 3. Buscar todas as lições de um módulo
    public List<Lesson> GetLessonsByModuleId(string moduleId)
    {
        return _mongoDbService.GetCollectionData<Lesson>(_lessonsCollection)
            .Where(l => l.ModuleId == moduleId)
            .ToList();
    }

    // 📌 4. Atualizar uma lição (apenas professores podem modificar)
    public bool UpdateLesson(string teacherId, string lessonId, Lesson updatedLesson)
    {
        var lesson = GetLessonById(lessonId);
        if (lesson == null)
        {
            return false; // Lição não encontrada
        }

        var module = _mongoDbService.GetDocumentByID<Module>(_modulesCollection, new ObjectId(lesson.ModuleId));
        if (module == null)
        {
            return false; // Módulo não encontrado
        }

        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(module.CourseId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        updatedLesson.Id = lessonId; // Mantém o mesmo ID da lição
        updatedLesson.ModuleId = lesson.ModuleId; // Mantém o módulo vinculado

        _mongoDbService.UpdateDocument(_lessonsCollection, new ObjectId(lessonId), updatedLesson);
        return true;
    }

    // 📌 5. Excluir uma lição (apenas professores podem excluir)
    public bool DeleteLesson(string teacherId, string lessonId)
    {
        var lesson = GetLessonById(lessonId);
        if (lesson == null)
        {
            return false; // Lição não encontrada
        }

        var module = _mongoDbService.GetDocumentByID<Module>(_modulesCollection, new ObjectId(lesson.ModuleId));
        if (module == null)
        {
            return false; // Módulo não encontrado
        }

        var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(module.CourseId));
        if (course == null || course.InstructorId != teacherId)
        {
            return false; // Curso não encontrado ou usuário não tem permissão
        }

        // Remover a lição do módulo
        module.LessonsIds.Remove(lesson.Id);
        _mongoDbService.UpdateDocument(_modulesCollection, new ObjectId(module.Id), module);

        return _mongoDbService.DeleteDocument<Lesson>(_lessonsCollection, new ObjectId(lessonId));
    }
}
