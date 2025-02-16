using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace CursosOnline.Model
{
    public class Cart
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string UserId { get; set; } // ID do usuário que possui esse carrinho

        public List<string> CourseIds { get; set; } = new List<string>(); // Lista de IDs dos cursos no carrinho
    }
}
