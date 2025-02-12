using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq.Expressions;
using System.Runtime.InteropServices;

namespace MongoDbConnection
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        // Construtor que recebe a string de conexão e o nome do banco de dados
        public MongoDbService(string connectionString, string databaseName)
        {
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        // Exemplo de método para pegar todos os documentos de uma coleção
        public List<T> GetCollectionData<T>(string collectionName)
        {
            var collection = _database.GetCollection<T>(collectionName);
            return collection.Find(new BsonDocument()).ToList();
        }

        public T GetDocumentByID<T>(string collectionName, ObjectId id)
        {
            var collection = _database.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("Id", id);

            return collection.Find(filter).First();
        }

        // Exemplo de método para inserir um documento
        public void InsertDocument<T>(string collectionName, T document)
        {
            var collection = _database.GetCollection<T>(collectionName);
            collection.InsertOne(document);
        }

        // Exemplo de método para atualizar um documento

        public void UpdateDocument<T>(string collectionName, ObjectId id, T document)
        {
            var collection = _database.GetCollection<T>(collectionName);

            // Garante que o _id do documento seja o mesmo fornecido
            var bsonDocument = document.ToBsonDocument();
            bsonDocument["_id"] = id; // Garante a consistência do campo _id

            var result = collection.ReplaceOne(
                new BsonDocument("_id", id),  // Filtro pelo _id
                BsonSerializer.Deserialize<T>(bsonDocument), // Documento com _id corrigido
                new ReplaceOptions { IsUpsert = true } // Opção para inserir se não encontrado
            );
        }

        // Exemplo de método para excluir um documento
        public void DeleteDocument<T>(string collectionName, ObjectId id)
        {
            var collection = _database.GetCollection<T>(collectionName);
            var filter = Builders<T>.Filter.Eq("Id", id);
            collection.DeleteOne(filter);
        }

        public async Task<List<T>> FindAsync<T>(string collectionName, Expression<Func<T, bool>> filter)
        {
            var collection = _database.GetCollection<T>(collectionName);
            return await collection.Find(filter).ToListAsync();
        }
    }
}
