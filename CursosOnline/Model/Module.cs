using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;

public class Module
{
    //Agora Id é uma string com [BsonRepresentation(BsonType.ObjectId)], garantindo compatibilidade com MongoDB.
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // Gera um ID automaticamente
    public string? Name { get; set; }
    [BsonRepresentation(BsonType.ObjectId)]
    public string CourseId { get; set; } // ID do curso ao qual o módulo pertence
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> LessonsIds { get; set; } = new(); // Lista de IDs das lições
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ExamId { get; set; } // ID do exame associado ao módulo
    public Exam? Exam { get; set; } // Adicionando o atributo Exam

    public Module()
    {
        LessonsIds = new List<string>();
    }

    public Module(string id, string name, string courseId)
    {
        Id = id;
        Name = name;
        CourseId = courseId;
    }

    public override string ToString()
    {
        return $"[ModuleID: {Id}, Name: {Name}, CourseID: {CourseId}, LessonsCount: {LessonsIds.Count}, ExamID: {ExamId}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Module other)
        {
            return other.Id == Id;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}
