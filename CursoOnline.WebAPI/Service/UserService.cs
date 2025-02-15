using MongoDB.Bson;
using MongoDB.Driver;
using CursosOnline.Model;
using MongoDbConnection;
using System.Security.Cryptography;
using System.Text;

namespace CursosOnline.Services;

public class UserService
{
    private readonly MongoDbService _mongoDbService;
    private readonly JwtService _jwtService;
    private readonly string _collectionName = "Users";

    public UserService(MongoDbService mongoDbService, JwtService jwtService)
    {
        _mongoDbService = mongoDbService;
        _jwtService = jwtService;
    }

    // 1. Cadastrar novo usuário
    public bool RegisterUser(User user)
    {

        if (user == null || string.IsNullOrWhiteSpace(user.PasswordHash))
        {
            throw new ArgumentException("Usuário inválido. A senha não pode ser nula ou vazia.");
        }

        // Garante que o ID seja gerado se não for fornecido
        if (string.IsNullOrEmpty(user.Id))
        {
            user.Id = ObjectId.GenerateNewId().ToString();
        }

        // Verifica se o e-mail já está cadastrado
        var existingUser = _mongoDbService.GetDocumentByField<User>(_collectionName, "Email", user.Email);
        if (existingUser != null)
        {
            return false; // Usuário já existe
        }

        // Hash da senha antes de salvar
        user.PasswordHash = HashPassword(user.PasswordHash);

        _mongoDbService.InsertDocument(_collectionName, user);
        return true;
    }

    // 2. Autenticar usuário (login) e gerar JWT
    public string? AuthenticateUser(string email, string password)
    {
        var user = _mongoDbService.GetDocumentByField<User>(_collectionName, "Email", email);
        if (user == null || !VerifyPassword(password, user.PasswordHash))
        {
            return null; // Usuário não encontrado ou senha incorreta
        }

        // Gerar token JWT
        return _jwtService.GenerateToken(user.Id.ToString(), user.Email);
    }

    // 3. Buscar usuário por ID
    public User? GetUserById(string userId)
    {
        return _mongoDbService.GetDocumentByID<User>(_collectionName, new ObjectId(userId));
    }

    // 4. Atualizar usuário
    public bool UpdateUser(string userId, User updatedUser)
    {
        var existingUser = GetUserById(userId);
        if (existingUser == null)
        {
            return false; // Usuário não encontrado
        }

        // Se a senha foi alterada, precisa ser armazenada como hash
        if (!string.IsNullOrEmpty(updatedUser.PasswordHash) && updatedUser.PasswordHash != existingUser.PasswordHash)
        {
            updatedUser.PasswordHash = HashPassword(updatedUser.PasswordHash);
        }

        _mongoDbService.UpdateDocument(_collectionName, new ObjectId(userId), updatedUser);
        return true;
    }

    // 5. Excluir usuário
    public bool DeleteUser(string userId)
    {
        var result = _mongoDbService.DeleteDocument<User>(_collectionName, new ObjectId(userId));
        return result;
    }

    // 6. Listar todos os usuários
    public List<User> GetAllUsers()
    {
        return _mongoDbService.GetCollectionData<User>(_collectionName);
    }

    // 7. Buscar usuário por e-mail
    public User? GetUserByEmail(string email)
    {
        return _mongoDbService.GetDocumentByField<User>(_collectionName, "Email", email);
    }

    // Função auxiliar: Criar hash de senha
    public string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("A senha não pode ser nula ou vazia.");
        }

        using var sha256 = SHA256.Create();
        byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    // Função auxiliar: Verificar senha com hash
    public bool VerifyPassword(string inputPassword, string storedHash)
    {
        string inputHash = HashPassword(inputPassword);
        return inputHash == storedHash;
    }
}
