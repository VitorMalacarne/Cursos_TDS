using MongoDB.Bson;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;
using System.Linq;

namespace CursosOnline.Services
{
    public class CartService
    {
        private readonly MongoDbService _mongoDbService;
        private readonly string _collectionName = "Carts";
        private readonly string _coursesCollection = "Courses";
        private readonly PurchaseHistoryService _purchaseHistoryService;

        public CartService(MongoDbService mongoDbService, PurchaseHistoryService purchaseHistoryService)
        {
            _mongoDbService = mongoDbService;
            _purchaseHistoryService = purchaseHistoryService;
        }

        // Obter o carrinho do usuário
        public Cart GetCartByUserId(string userId)
        {
            var cart = _mongoDbService.GetCollectionData<Cart>(_collectionName)
                        .FirstOrDefault(c => c.UserId == userId);

            if (cart == null)
            {
                // Criar um novo carrinho para o usuário se não existir
                cart = new Cart { UserId = userId, CourseIds = new List<string>() };
                _mongoDbService.InsertDocument(_collectionName, cart);
            }

            return cart;
        }

        // Adicionar um curso ao carrinho
        public bool AddCourseToCart(string userId, string courseId)
        {
            var cart = GetCartByUserId(userId);

            // Verificar se o curso existe
            var course = _mongoDbService.GetDocumentByID<Course>(_coursesCollection, new ObjectId(courseId));
            if (course == null)
            {
                return false; // Curso não encontrado
            }

            if (!cart.CourseIds.Contains(courseId))
            {
                cart.CourseIds.Add(courseId);
                _mongoDbService.UpdateDocument(_collectionName, new ObjectId(cart.Id), cart);
                return true;
            }

            return false;
        }

        // Remover um curso do carrinho
        public bool RemoveCourseFromCart(string userId, string courseId)
        {
            var cart = GetCartByUserId(userId);

            if (cart.CourseIds.Contains(courseId))
            {
                cart.CourseIds.Remove(courseId);
                _mongoDbService.UpdateDocument(_collectionName, new ObjectId(cart.Id), cart);
                return true;
            }

            return false;
        }

        // Esvaziar o carrinho
        public bool ClearCart(string userId)
        {
            var cart = GetCartByUserId(userId);
            cart.CourseIds.Clear();
            _mongoDbService.UpdateDocument(_collectionName, new ObjectId(cart.Id), cart);
            return true;
        }

        // Finalizar compra: Move os cursos do carrinho para o histórico de compras
        public bool CheckoutCart(string userId)
        {
            var cart = GetCartByUserId(userId);

            if (cart.CourseIds.Count == 0)
            {
                return false; // Carrinho vazio, nada para finalizar
            }

            // Adicionar os cursos ao histórico de compras
            foreach (var courseId in cart.CourseIds)
            {
                _purchaseHistoryService.AddPurchase(userId, courseId);
            }

            // Esvaziar o carrinho após a compra
            cart.CourseIds.Clear();
            _mongoDbService.UpdateDocument(_collectionName, new ObjectId(cart.Id), cart);

            return true;
        }
    }
}
