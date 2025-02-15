<<<<<<< HEAD
namespace CursosOnline.Model;
public class Exam
{
  public int ExamID { get; private set; }
  public string Name { get; private set; }
  public List<Question> Questions { get; private set; }

  public Exam(int id, string name)
  {
    ExamID = id;
    Name = name;
    Questions = new List<Question>();
  }

  public void AddQuestion(Question question)
  {
    Questions.Add(question);
  }

  public int GradeExam(List<int> userAnswers)
  {
    int score = 0;
    for (int i = 0; i < Questions.Count; i++)
    {
      if (Questions[i].CheckAnswer(userAnswers[i]))
      {
        score++;
      }
    }
    return score;
  }
=======
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;
public class Exam
{
  //Agora Id é uma string com [BsonRepresentation(BsonType.ObjectId)], garantindo compatibilidade com MongoDB.
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // Gera um ID automaticamente
  public string Name { get; set; }
  [BsonRepresentation(BsonType.ObjectId)]
    public string ModuleId { get; set; } // ID do módulo ao qual o exame pertence
  public List<String> QuestionIds { get; set; }

  public Exam() { }


  public Exam(string id, string name, string moduleId)
  {
    Id = id;
    Name = name;
    ModuleId = moduleId;
    QuestionIds = new List<string>();
  }

  public void AddQuestion(string question) // mudei para usar o id da questão ao inves de mandar a questão inteira
  {
    QuestionIds.Add(question);
  }

    public override string ToString()
    {
        return $"[ExamID: {Id}, Name: {Name}, ModuleID: {ModuleId}, QuestionsCount: {QuestionIds.Count}]";
    }

    public override bool Equals(object? obj)
    {
        return obj is Exam other && other.Id == Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
>>>>>>> SamuelMoroBranch
}
