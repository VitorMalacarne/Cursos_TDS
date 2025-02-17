using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;

public class Course
{
    //Agora Id é uma string com [BsonRepresentation(BsonType.ObjectId)], garantindo compatibilidade com MongoDB.
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }  = ObjectId.GenerateNewId().ToString(); // Gera um ID automaticamente
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Type { get; set; }

    // Relacionamentos
    public string InstructorId { get; set; } //Mudei de ObjectId para string para se adequar ao modelo
    public User? Instructor { get; set; } // Instrutor do curso
    public ICollection<User> Students { get; set; } = new List<User>(); // Alunos matriculados

    // Adicionamos um campo para a URL da imagem do curso
    public string ImageUrl { get; set; } = "https://i.pinimg.com/736x/d1/43/79/d143798f0a2ccd1eba3101c4ff705567.jpg";

    public List<Module>? Modules { get; set; } // Lista de módulos do curso
    public List<string>? Topics { get; set; } // Lista de tópicos do curso
    public List<Enrollment>? Enrollments { get; set; } // Lista de matrículas

    // Construtor com parâmetros essenciais
    public Course(string id, string name, decimal price)
    {
        Id = id;
        Name = name;
        Price = price;
    }

    public Course() { }

    // Construtor completo
    public Course(string id, string name, string description, decimal price, string type, string instructorId, List<string>? topics)
    {
        Id = id;
        Name = name;
        Description = description;
        Price = price;
        Type = type;
        InstructorId = instructorId;
        Topics = topics;
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

    public List<Course> ToList()
    {
        throw new NotImplementedException();
    }
}
