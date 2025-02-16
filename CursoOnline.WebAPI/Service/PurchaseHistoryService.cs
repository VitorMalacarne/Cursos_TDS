using MongoDB.Bson;
using CursosOnline.Model;
using MongoDbConnection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CursosOnline.Services
{
    public class PurchaseHistoryService
    {
        private readonly MongoDbService _mongoDbService;
        private readonly string _collectionName = "PurchaseHistories";

        public PurchaseHistoryService(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        // Obter o histórico de compras do usuário
        public PurchaseHistory GetPurchaseHistoryByUserId(string userId)
        {
            var history = _mongoDbService.GetCollectionData<PurchaseHistory>(_collectionName)
                            .FirstOrDefault(h => h.UserId == userId);

            return history ?? new PurchaseHistory { UserId = userId, Purchases = new List<PurchaseRecord>() };
        }

        // Registrar uma compra no histórico
        public bool AddPurchase(string userId, string courseId)
        {
            var history = GetPurchaseHistoryByUserId(userId);

            // Verifica se o curso já foi comprado
            if (history.Purchases.Any(p => p.CourseId == courseId))
            {
                return false; // Curso já comprado anteriormente
            }

            // Adiciona a compra ao histórico
            history.Purchases.Add(new PurchaseRecord
            {
                CourseId = courseId,
                PurchaseDate = DateTime.UtcNow
            });

            _mongoDbService.UpdateDocument(_collectionName, new ObjectId(history.Id), history);
            return true;
        }

        // Verifica se o usuário já comprou um curso
        public bool HasPurchasedCourse(string userId, string courseId)
        {
            var history = GetPurchaseHistoryByUserId(userId);
            return history.Purchases.Any(p => p.CourseId == courseId);
        }
    }
}
