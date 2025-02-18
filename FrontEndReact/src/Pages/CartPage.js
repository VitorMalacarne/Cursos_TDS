import { useEffect, useState } from "react";
import "../css/CartPage.css";
import CartService from "../Services/CartService";
import CourseService from "../Services/CourseService";
import UserService from "../Services/UserService";

const initialCartItems = [
    {
        id: 1,
        title: "Masterclass de Programação Fullstack",
        instructor: "João Silva",
        price: 199.9,
        image: "/placeholder.svg?height=80&width=120",
    },
    {
        id: 2,
        title: "Design de UX/UI: Do Conceito ao Protótipo",
        instructor: "Maria Santos",
        price: 149.9,
        image: "/placeholder.svg?height=80&width=120",
    },
];

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

        // Para cada curso, fazemos a requisição do instrutor correspondente
        const instructorPromises = courses.map(course => {
            if (!course.instructorId) return Promise.resolve(null); // Se não houver instrutor, retorna null

            return UserService.getById(course.instructorId)
                .then((response) => response.data)
                .catch((error) => {
                    console.error(`Erro ao buscar instrutor para o curso ${course.name}`, error);
                    return null; // Retorna null em caso de erro
                });
        });

        // Aguarda todas as requisições de instrutores e atualiza o estado
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

    //const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    //const discount = 0;
    //const total = subtotal - discount;

    const removeItem = (id) => {
        //setCartItems(cartItems.filter((item) => item.id !== id));
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
                        {/* <div className="ct-summary-row">
                            <span>Subtotal:</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                            <div className="ct-summary-row ct-discount">
                                <span>Desconto:</span>
                                <span>- R$ {discount.toFixed(2)}</span>
                            </div>
                        )} */}
                        <div className="ct-summary-row ct-total">
                            <span>Total: {formatToReal(calculateTotalPrice())}</span>
                            {/* <span>R$ {total.toFixed(2)}</span> */}
                        </div>

                        {/* <form onSubmit={applyCoupon} className="ct-coupon-form">
                            <input
                                type="text"
                                placeholder="Código do cupom"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button type="submit">Aplicar</button>
                        </form> */}

                        <button className="ct-btn-primary ct-checkout-btn">Finalizar Compra</button>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default CartPage;
