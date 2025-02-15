using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;
public class Lesson
{
    //Agora Id é uma string com [BsonRepresentation(BsonType.ObjectId)], garantindo compatibilidade com MongoDB.
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }   = ObjectId.GenerateNewId().ToString(); // Gera um ID automaticamente
    public string? Title { get; set; }
    public string? Content { get; set; }
    [BsonRepresentation(BsonType.ObjectId)]
    public string ModuleId { get; set; } // ID do módulo ao qual a lição pertence
    public TimeSpan Duration { get; set; } = TimeSpan.Zero; // Inicia com 0 por padrão

    public Lesson() { }

    public Lesson(string id, string title, string content, string moduleId, TimeSpan duration)
    {
        Id = id;
        Title = title;
        Content = content;
        ModuleId = moduleId;
        Duration = duration;
    }

    public override string ToString()
    {
        return $"[LessonID: {Id}, Title: {Title}, ModuleID: {ModuleId}, Duration: {Duration}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Lesson other)
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