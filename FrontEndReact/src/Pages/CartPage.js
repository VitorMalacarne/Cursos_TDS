import { useEffect, useState } from "react";
import "../css/CartPage.css";
import CartService from "../Services/CartService";
import CourseService from "../Services/CourseService";
import UserService from "../Services/UserService";
import EnrollmentService from "../Services/EnrollmentService";

function CartPage() {
    const [cart, setCart] = useState({});
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [couponCode, setCouponCode] = useState("");

    useEffect(() => {
        CartService.getCart()
            .then((response) => {
                const fetchedCart = response.data;
                setCart(fetchedCart);
            })
            .catch((error) => {
                console.error("Erro ao buscar carrinho", error);
            });
    }, []);

    useEffect(() => {
        if (!cart || !cart.courseIds || cart.courseIds.length === 0) return;

        const courseIds = cart.courseIds;

        if (courseIds.length === 0) return;

        Promise.all(courseIds.map(id => CourseService.getById(id)))
            .then((responses) => {
                const fetchedCourses = responses.map(response => response.data);
                setCourses(fetchedCourses);
            })
            .catch((error) => {
                console.error("Erro ao buscar cursos", error);
            });
    }, [cart]);

    useEffect(() => {
        if (!courses || courses.length === 0) return;

        const instructorPromises = courses.map(course => {
            if (!course.instructorId) return Promise.resolve(null); // Se não houver instrutor, retorna null

            return UserService.getById(course.instructorId)
                .then((response) => response.data)
                .catch((error) => {
                    console.error(`Erro ao buscar instrutor para o curso ${course.name}`, error);
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
    }, [courses]);

    const formatToReal = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const calculateTotalPrice = () => {
        const total = courses.reduce((sum, course) => sum + (course.price || 0), 0);
        return total;
    };

    // Função para remover o item
    const removeItem = (id) => {
        CartService.remove(id)
            .then(() => {
                // Atualiza a lista de cursos após a remoção
                setCourses(courses.filter(course => course.id !== id));
            })
            .catch((error) => {
                console.error("Erro ao remover item do carrinho", error);
            });
    };

    const handleCheckout = () => {
        // Cria um array de promessas de requisições POST para inscrição
        const enrollmentPromises = courses.map(course => {
            // Primeiro, removemos o curso do carrinho imediatamente
            // Atualiza o estado de cursos para refletir a remoção no carrinho
            setCourses(prevCourses => prevCourses.filter(c => c.id !== course.id));
    
            // Em seguida, faz a inscrição no curso
            return EnrollmentService.post(course.id)
                .then((response) => {
                    console.log(`Inscrição realizada para o curso ${course.title}`, response.data);
    
                    // Agora, depois que a inscrição foi feita, podemos efetivamente remover o curso do backend
                    return CartService.remove(course.id)
                        .then(() => {
                            console.log(`Curso ${course.title} removido do carrinho com sucesso.`);
                        })
                        .catch((error) => {
                            console.error(`Erro ao remover curso ${course.title} do carrinho`, error);
                        });
                })
                .catch((error) => {
                    console.error(`Erro ao se inscrever no curso ${course.title}`, error);
                });
        });
    
        // Aguarda que todas as promessas sejam resolvidas
        Promise.all(enrollmentPromises)
            .then(() => {
                console.log("Inscrição em todos os cursos realizada com sucesso.");
                // Aqui você pode fazer algo, como redirecionar o usuário para uma página de confirmação
            })
            .catch((error) => {
                console.error("Erro ao processar inscrições", error);
            });
    };

    const applyCoupon = (e) => {
        e.preventDefault();
        console.log("Applying coupon:", couponCode);
    };

    return (
        <div className="ct-shopping-cart">
            <main className="ct-cart-content">
                <h1>Seu Carrinho</h1>
                <div className="ct-cart-grid">
                    <section className="ct-cart-items">
                        {courses.map((item, index) => (
                            <div key={item.id} className="ct-cart-item">
                                <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="ct-item-image" />
                                <div className="ct-item-details">
                                    <h3>{item.name}</h3>
                                    {/* Verifica se o instrutor existe e exibe o nome */}
                                    <p>por {instructors[index]?.name || "Instrutor desconhecido"}</p>
                                </div>
                                <div className="ct-item-price">{formatToReal(item.price)}</div>
                                <button onClick={() => removeItem(item.id)} className="ct-remove-item">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </section>

                    <aside className="ct-order-summary">
                        <h2>Resumo do Pedido</h2>
                        <div className="ct-summary-row ct-total">
                            <span>Total: {formatToReal(calculateTotalPrice())}</span>
                        </div>

                        <button className="ct-btn-primary ct-checkout-btn" onClick={handleCheckout}>Finalizar Compra</button>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default CartPage;
