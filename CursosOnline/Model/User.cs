namespace CursosOnline.Model;

public class User
{
    public int UserID { get; set; }
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Cpf { get; set; }
    public string? Password { get; set; }
    public string? Role { get; set; }
    public ICollection<Course> CursosComprados { get; set; } = new List<Course>();
    public ICollection<Course> CursosComoInstrutor { get; set; } = new List<Course>();

    // Construtor padrão
    public User() { }

    // Construtor com parâmetros essenciais
    public User(int userID, string name, string email, string role)
    {
        UserID = userID;
        Name = name;
        Email = email;
        Role = role;
    }

    // Construtor completo
    public User(int userID, string name, string phone, string email, string cpf, string password, string role)
    {
        UserID = userID;
        Name = name;
        Phone = phone;
        Email = email;
        Cpf = cpf;
        Password = password;
        Role = role;
    }

    // ToString para exibição
    public override string ToString()
    {
        return $"UserID: {UserID}, Name: {Name}, Email: {Email}, Role: {Role}";
    }

    public override bool Equals(object? obj)
    {
        if (obj is User other)
        {
            return other.UserID == UserID;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return UserID.GetHashCode();
    }
}
