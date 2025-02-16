using MongoDB.Bson;
using CursosOnline.Model;
using MongoDbConnection;
using System.Collections.Generic;

namespace CursosOnline.Services
{
    public class WishlistService
    {
        private readonly MongoDbService _mongoDbService;
        private readonly string _collectionName = "Wishlists";

        public WishlistService(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        // Obter ou criar a lista de desejos do usuário
        public Wishlist GetWishlistByUserId(string userId)
        {
            var wishlist = _mongoDbService.GetCollectionData<Wishlist>(_collectionName)
                        .FirstOrDefault(w => w.UserId == userId);

            // Se não existir, cria e salva no banco
            if (wishlist == null)
            {
                wishlist = new Wishlist { UserId = userId };
                _mongoDbService.InsertDocument(_collectionName, wishlist);
            }

            return wishlist;
        }

        // Adicionar um curso à lista de desejos
        public bool AddCourseToWishlist(string userId, string courseId)
        {
            var wishlist = GetWishlistByUserId(userId);

            if (!wishlist.CourseIds.Contains(courseId))
            {
                wishlist.CourseIds.Add(courseId);
                _mongoDbService.UpdateDocument(_collectionName, new ObjectId(wishlist.Id), wishlist);
                return true;
            }

            return false;
        }

        // Remover um curso da lista de desejos
        public bool RemoveCourseFromWishlist(string userId, string courseId)
        {
            var wishlist = GetWishlistByUserId(userId);

            if (wishlist.CourseIds.Contains(courseId))
            {
                wishlist.CourseIds.Remove(courseId);
                _mongoDbService.UpdateDocument(_collectionName, new ObjectId(wishlist.Id), wishlist);
                return true;
            }

            return false;
        }

        // Esvaziar a lista de desejos
        public bool ClearWishlist(string userId)
        {
            var wishlist = GetWishlistByUserId(userId);
            wishlist.CourseIds.Clear();
            _mongoDbService.UpdateDocument(_collectionName, new ObjectId(wishlist.Id), wishlist);
            return true;
        }
    }
}
