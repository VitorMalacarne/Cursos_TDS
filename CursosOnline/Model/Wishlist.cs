using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace CursosOnline.Model
{
    public class Wishlist
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string UserId { get; set; } // ID do usuário dono da lista

        public List<string> CourseIds { get; set; } = new List<string>(); // Cursos salvos na lista de desejos

        // Construtor vazio para evitar problemas de serialização
        public Wishlist() { }
    }
}
