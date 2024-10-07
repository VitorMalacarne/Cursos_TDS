namespace CursosOnline.Modelo;

public class Aluno
{
  public int Id { get; set; }
  public string Nome { get; set; }
  public List<Inscricao> Inscricoes { get; set; }
}