using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace CursosOnline.Model
{
    public class User
    {
        // Definindo o campo de ID como ObjectId, padrão do MongoDB
        [BsonId]  // Este atributo indica que o campo 'Id' é o identificador do documento
        public ObjectId Id { get; set; } // Usando ObjectId em vez de int como identificador

        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Cpf { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }

        // Coleções de cursos (ID de cursos como string, ou pode ser um tipo específico dependendo do seu modelo)
        public ICollection<string> CursosComprados { get; set; } = new List<string>();
        public ICollection<string> CursosComoInstrutor { get; set; } = new List<string>();

        // Construtor padrão
        public User() { }

        // Construtor com parâmetros essenciais
        public User(ObjectId id, string name, string email, string role)
        {
            Id = id;
            Name = name;
            Email = email;
            Role = role;
        }

        // Construtor completo
        public User(ObjectId id, string name, string phone, string email, string cpf, string password, string role)
        {
            Id = id;
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
            return $"UserID: {Id}, Name: {Name}, Email: {Email}, Role: {Role}";
        }

        public override bool Equals(object? obj)
        {
            if (obj is User other)
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
}