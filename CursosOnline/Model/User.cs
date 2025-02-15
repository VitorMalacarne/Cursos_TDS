using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace CursosOnline.Model
{
    public class User
    {
        //Agora Id é uma string com [BsonRepresentation(BsonType.ObjectId)], garantindo compatibilidade com MongoDB.
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // Gera um ID automaticamente

        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Cpf { get; set; }
        public string? PasswordHash { get; set; } // Armazena o hash da senha
        public string? Role { get; set; }

        // Coleções de cursos (ID de cursos como string, ou pode ser um tipo específico dependendo do seu modelo)
        public ICollection<string> CursosComprados { get; set; } = new List<string>();
        public ICollection<string> CursosComoInstrutor { get; set; } = new List<string>();

        // Construtor padrão para garantir que o ID sempre será gerado
        public User() {
            Id = ObjectId.GenerateNewId().ToString();
        }

        // Construtor com parâmetros essenciais
        public User(string id, string name, string email, string role)
        {
            Id = id;
            Name = name;
            Email = email;
            Role = role;
        }

        // Construtor completo
        public User(string id, string name, string phone, string email, string cpf, string passwordHash, string password, string role)
        {
            Id = id;
            Name = name;
            Phone = phone;
            Email = email;
            Cpf = cpf;
            PasswordHash = passwordHash; //adicionado passwordhash no contrutor
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