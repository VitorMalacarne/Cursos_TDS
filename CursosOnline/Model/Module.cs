using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;
public class Module
{
    public ObjectId Id { get; set; }
    public string? Name { get; set; }
    public List<Lesson>? Lessons { get; set; }
    public Exam? Exam { get; set; } // Adicionando o atributo Exam

    public Module()
    {
        Lessons = new List<Lesson>();
    }

    public Module(ObjectId id, string name)
    {
        Id = id;
        Name = name;
        Lessons = new List<Lesson>();
    }

    public override string ToString()
    {
        return $"[ModuleID: {Id}, Name: {Name}, Lessons: {Lessons?.Count}, Exam: {Exam?.Name}]";
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
