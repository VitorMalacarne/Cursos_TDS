using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CursosOnline.Model;
public class Question
{
  //Agora Id é uma string com [BsonRepresentation(BsonType.ObjectId)], garantindo compatibilidade com MongoDB.
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // Gera um ID automaticamente
  public string Text { get; set; }
  public List<string> Options { get; set; }
  public int CorrectAnswerIndex { get; set; } // Index of the correct answer (0,1,2,3...)

  public Question() {}

  public Question(string id, string text, List<string> options, int correctAnswerIndex)
  {
    Id = id;
    Text = text;
    Options = options;
    CorrectAnswerIndex = correctAnswerIndex;
  }

  public bool CheckAnswer(int userAnswer)
  {
    return userAnswer == CorrectAnswerIndex;
  }
}
