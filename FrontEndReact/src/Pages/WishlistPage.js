import { useEffect, useState } from "react"
import "../css/WishlistPage.css"
import WishlistService from "../Services/WishlistService";
import CourseService from "../Services/CourseService";
import UserService from "../Services/UserService";
import CartService from "../Services/CartService";
import { useNavigate } from "react-router-dom";

function WishlistPage() {
    const [favorites, setFavorites] = useState([]);
    const [wishlist, setWishlist] = useState({});
    const [instructors, setInstructors] = useState([]);
    const [sortBy, setSortBy] = useState("rating");
    const navigate = useNavigate();

    useEffect(() => {
        WishlistService.getWishlist()
            .then((response) => {
                const fetchedWishlist = response.data;
                setWishlist(fetchedWishlist);
            })
            .catch((error) => {
                console.error("Erro ao buscar favoritos", error);
            });
    }, []);

    useEffect(() => {
        if (!wishlist || !wishlist.courseIds || wishlist.courseIds.length === 0) return;

        const courseIds = wishlist.courseIds;

        if (courseIds.length === 0) return;

        Promise.all(courseIds.map(id => CourseService.getById(id)))
            .then((responses) => {
                const fetchedCourses = responses.map(response => response.data);
                setFavorites(fetchedCourses);
            })
            .catch((error) => {
                console.error("Erro ao buscar cursos", error);
            });
    }, [wishlist]);

    useEffect(() => {
        if (!favorites || favorites.length === 0) return;

        const instructorPromises = favorites.map(favorite => {
            if (!favorite.instructorId) return Promise.resolve(null); // Se não houver instrutor, retorna null

            return UserService.getById(favorite.instructorId)
                .then((response) => response.data)
                .catch((error) => {
                    console.error(`Erro ao buscar instrutor para o curso ${favorite.name}`, error);
                    return null; // Retorna null em caso de erro
                });
        });

        Promise.all(instructorPromises)
            .then((instructors) => {
                setInstructors(instructors.filter(instructor => instructor !== null)); // Filtra os instrutores nulos
            })
            .catch((error) => {
                console.error("Erro ao buscar instrutores", error);
            });
    }, [favorites]);

    const formatToReal = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleAddToCart = (course) => {
        CartService.add(course.id);
      
        // Exemplo de um alerta mais estilizado com texto
        alert(`🎉 ${course.name} foi adicionado ao seu carrinho! 🚀`);
      };

    const removeFavorite = (id) => {
            WishlistService.remove(id)
                .then(() => {
                    // Atualiza a lista de cursos após a remoção
                    setFavorites(favorites.filter(course => course.id !== id));
                })
                .catch((error) => {
                    console.error("Erro ao remover item do carrinho", error);
                });
        };

    // const sortedFavorites = [...favorites].sort((a, b) => {
    //     if (sortBy === "price") {
    //         return a.price - b.price
    //     } else {
    //         return b.rating - a.rating
    //     }
    // })

    return (
        <div className="wl-favorites-wishlist">
            <main className="wl-favorites-content">
                <h1>Seus Favoritos</h1>

                {/* <div className="wl-favorites-controls">
                    <div className="wl-favorites-count">{favorites.length} cursos</div>
                    <div className="wl-sort-control">
                        <label htmlFor="wl-sort-select">Ordenar por:</label>
                        <select id="wl-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="rating">Melhor avaliados</option>
                            <option value="price">Preço: menor - maior</option>
                        </select>
                    </div>
                </div> */}

                {favorites.length === 0 ? (
                    <div className="wl-empty-favorites">
                        <h2>Sua lista de favoritos está vazia</h2>
                        <p>Explore nossos cursos e adicione alguns à sua lista!</p>
                        <a href="#" className="wl-btn-primary" onClick={() => navigate("/")}>
                            Explorar Cursos
                        </a>
                    </div>
                ) : (
                    <div className="wl-favorites-grid">
                        {favorites.map((course, index) => (
                            <div key={course.id} className="wl-favorite-item" onClick={() => navigate(`/coursepage/${course.id}`)}>
                                <img src={course.imageUrl || "/placeholder.svg"} alt={course.title} className="wl-course-image" />
                                <div className="wl-course-info">
                                    <h3>{course.name}</h3>
                                    <p className="wl-instructor">por {instructors[index]?.name}</p>
                                    {/* <div className="wl-course-meta">
                                        <span className="wl-rating">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            {course.rating.toFixed(1)}
                                        </span>
                                        <span className="wl-students">{course.students.toLocaleString()} alunos</span>
                                    </div> */}
                                    <div className="wl-course-price">
                                        <span className="wl-current-price">{formatToReal(course.price)}</span>
                                        {/* <span className="wl-original-price">R$ {formatToReal(course.price)}</span> */}
                                    </div>
                                </div>
                                <div className="wl-course-actions">
                                    <button className="wl-btn-primary" onClick={() => handleAddToCart(course)}>Adicionar ao Carrinho</button>
                                    <button className="wl-btn-secondary" onClick={() => removeFavorite(course.id)}>
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default WishlistPage;