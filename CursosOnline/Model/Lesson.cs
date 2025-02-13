using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;
public class Lesson
{
    // Definindo o campo de ID como ObjectId, padrão do MongoDB
    [BsonId]  // Este atributo indica que o campo 'Id' é o identificador do documento
    public ObjectId Id { get; set; } // Usando ObjectId em vez de int como identificador
    public string? Title { get; set; }
    public string? Content { get; set; }
    public TimeSpan? Duration { get; set; }

    public Lesson() { }

    public Lesson(ObjectId id, string title, string content, TimeSpan duration)
    {
        Id = id;
        Title = title;
        Content = content;
        Duration = duration;
    }

    public override string ToString()
    {
        return $"[{Id}, {Title}, {Content}, {Duration}]";
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