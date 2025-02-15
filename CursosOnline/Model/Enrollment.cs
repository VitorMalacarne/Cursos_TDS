using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;

public class Enrollment
{
    //Agora Id é uma string com [BsonRepresentation(BsonType.ObjectId)], garantindo compatibilidade com MongoDB.
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    [BsonRepresentation(BsonType.ObjectId)]
    public string StudentId { get; set; }  // ID do aluno

    [BsonRepresentation(BsonType.ObjectId)]
    public string CourseId { get; set; }  // ID do curso
    public DateTime? EnrollmentDate { get; set; }
     public int Progress { get; set; } = 0; // Inicia com progresso 0%

    public Enrollment() { }

    public Enrollment(string id, string studentId, string courseId, DateTime enrollmentDate, int progress)
    {
        Id = id;
        StudentId = studentId;
        CourseId = courseId;
        EnrollmentDate = enrollmentDate;
        Progress = progress;
    }

    public override string ToString()
    {
        return $"[{Id}, {StudentId}, {CourseId}, {EnrollmentDate}, {Progress}]";
    }

    public override bool Equals(object? obj)
    {
        if (obj is Enrollment other)
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
