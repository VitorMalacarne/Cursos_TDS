using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;

public class Course
{
    public ObjectId Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Type { get; set; }

    // Relacionamentos
    public int? InstructorID { get; set; }
    public User? Instructor { get; set; } // Instrutor do curso
    public ICollection<User> Students { get; set; } = new List<User>(); // Alunos matriculados

    public List<Module>? Modules { get; set; } // Lista de módulos do curso
    public List<Enrollment>? Enrollments { get; set; } // Lista de matrículas

    // Construtor padrão
    public Course() { }

    // Construtor com parâmetros essenciais
    public Course(ObjectId id, string name, decimal price)
    {
        Id = id;
        Name = name;
        Price = price;
    }

    // Construtor completo
    public Course(ObjectId id, string name, string description, decimal price, string type, int? instructorID)
    {
        Id = id;
        Name = name;
        Description = description;
        Price = price;
        Type = type;
        InstructorID = instructorID;
    }

    // ToString para exibição
    public override string ToString()
    {
        return $"CourseID: {Id}, Name: {Name}, Price: {Price}, Type: {Type}";
    }

     public override bool Equals(object? obj)
    {
        if (obj is Course other)
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
