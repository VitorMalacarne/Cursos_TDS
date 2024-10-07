namespace CursosOnline.Modelo;
public class Curso
{
  public int Id { get; set; }
  public string Nome { get; set; }
  public List<Modulo> Modulos { get; set; }
  public decimal Preco { get; set; }
  public string Tipo { get; set; }
}