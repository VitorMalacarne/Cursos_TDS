using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace CursosOnline.Model
{
    public class PurchaseHistory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string UserId { get; set; } // ID do usuário que fez as compras

        public List<PurchaseRecord> Purchases { get; set; } = new List<PurchaseRecord>();
    }

    public class PurchaseRecord
    {
        public string CourseId { get; set; } // ID do curso comprado
        public DateTime PurchaseDate { get; set; } // Data da compra
    }
}
