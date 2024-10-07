namespace CursosOnline.Modelo;

public class Modulo
{
  public int Id { get; set; }
  public string Nome { get; set; }
  public List<Aula> Aulas { get; set; }
}