namespace CursosOnline.Model;
public class Question
{
  public int QuestionID { get; private set; }
  public string Text { get; private set; }
  public List<string> Options { get; private set; }
  public int CorrectAnswerIndex { get; private set; } // Index of the correct answer (0,1,2,3...)

  public Question(int id, string text, List<string> options, int correctAnswerIndex)
  {
    QuestionID = id;
    Text = text;
    Options = options;
    CorrectAnswerIndex = correctAnswerIndex;
  }

  public bool CheckAnswer(int userAnswer)
  {
    return userAnswer == CorrectAnswerIndex;
  }
}
