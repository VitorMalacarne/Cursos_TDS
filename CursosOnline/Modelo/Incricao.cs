namespace CursosOnline.Modelo;
public class Inscricao
{
  public int Id { get; set; }
  public Aluno Aluno { get; set; }
  public Curso Curso { get; set; }
  public DateTime DataInscricao { get; set; }
  public int Progresso { get; set; }
}