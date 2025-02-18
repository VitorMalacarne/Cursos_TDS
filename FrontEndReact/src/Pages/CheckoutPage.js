"use client";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/CheckoutPage.css";
import EnrollmentService from "../Services/EnrollmentService";
import CartService from "../Services/CartService";

export default function PaymentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courses, total } = location.state || { courses: [], total: 0 };
  const [selectedMethod, setSelectedMethod] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleConfirmPurchase = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }

    // Cria um array de promessas de requisições POST para inscrição
    const enrollmentPromises = courses.map((course) => {
      // Primeiro, removemos o curso do carrinho imediatamente
      setCourses((prevCourses) =>
        prevCourses.filter((c) => c.id !== course.id)
      );

      // Em seguida, faz a inscrição no curso
      return EnrollmentService.post(course.id)
        .then((response) => {
          console.log(
            `Inscrição realizada para o curso ${course.title}`,
            response.data
          );

          // Agora, depois que a inscrição foi feita, podemos efetivamente remover o curso do backend
          return CartService.remove(course.id)
            .then(() => {
              console.log(
                `Curso ${course.title} removido do carrinho com sucesso.`
              );
            })
            .catch((error) => {
              console.error(
                `Erro ao remover curso ${course.title} do carrinho`,
                error
              );
            });
        })
        .catch((error) => {
          console.error(`Erro ao se inscrever no curso ${course.title}`, error);
        });
    });

    Promise.all(enrollmentPromises)
      .then(() => {
        // Redirecionar para a página "Meu Aprendizado"
        navigate("/mylearning");
      })
      .catch((error) => {
        console.error("Erro ao processar a compra", error);
      });
  };

  const handleCancelPurchase = () => {
    // Redirecionar para a página do carrinho
    navigate("/cart");
  };

  const formatToReal = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="checkout-container">
      <div className="main-content">
        <h1>Finalizar compra</h1>

        <div className="payment-section">
          <h2>Forma de pagamento</h2>

          <div className="payment-methods">
            <div className="payment-method-group">
              <div
                className={`payment-method ${
                  selectedMethod === "pix" ? "selected" : ""
                }`}
                onClick={() => setSelectedMethod("pix")}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === "pix"}
                  onChange={() => setSelectedMethod("pix")}
                />
                <span>Pix</span>
              </div>
              {selectedMethod === "pix" && (
                <div className="payment-form">
                  <div className="form-group">
                    <label htmlFor="pixCpf">CPF/CNPJ</label>
                    <input
                      type="text"
                      id="pixCpf"
                      placeholder="Digite seu CPF ou CNPJ"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="payment-method-group">
              <div
                className={`payment-method ${
                  selectedMethod === "boleto" ? "selected" : ""
                }`}
                onClick={() => setSelectedMethod("boleto")}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === "boleto"}
                  onChange={() => setSelectedMethod("boleto")}
                />
                <span>Boleto bancário</span>
              </div>
              {selectedMethod === "boleto" && (
                <div className="payment-form">
                  <div className="form-group">
                    <label htmlFor="boletoCpf">CPF/CNPJ</label>
                    <input
                      type="text"
                      id="boletoCpf"
                      placeholder="Digite seu CPF ou CNPJ"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="payment-method-group">
              <div
                className={`payment-method ${
                  selectedMethod === "card" ? "selected" : ""
                }`}
                onClick={() => setSelectedMethod("card")}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === "card"}
                  onChange={() => setSelectedMethod("card")}
                />
                <span>Cartão de Crédito</span>
              </div>
              {selectedMethod === "card" && (
                <div className="payment-form">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Número do cartão</label>
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiry">Prazo</label>
                      <input type="text" id="expiry" placeholder="MM/AA" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvc">CVC/CVV</label>
                      <input type="text" id="cvc" placeholder="CVC" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cardName">Nome no cartão</label>
                      <input
                        type="text"
                        id="cardName"
                        placeholder="Nome no cartão"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardCpf">CPF/CNPJ</label>
                      <input type="text" id="cardCpf" placeholder="CPF/CNPJ" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-details">
          <h2>Detalhes do pedido</h2>
          {courses.map((course) => (
            <div key={course.id} className="course-item">
              <img
                src={course.imageUrl || "/placeholder.svg"}
                alt={course.name}
              />
              <div className="course-info">
                <h3>{course.name}</h3>
                <div className="price-info">
                  <span className="current-price">
                    {formatToReal(course.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="confirm-button"
            onClick={handleConfirmPurchase}
          >
            Confirmar compra
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancelPurchase}
          >
            Cancelar compra
          </button>
        </div>
      </div>

      <div className="order-summary">
        <h2>Resumo do pedido</h2>
        <div className="summary-content">
          <div className="summary-row">
            <span>Preço original:</span>
            <span>{formatToReal(total)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatToReal(total)}</span>
          </div>
          <button className="proceed-button" onClick={handleConfirmPurchase}>
            Confirmar Compra
          </button>
          <p className="terms">
            Ao concluir sua compra, você concorda com estes
            <a href="#" className="terms-link">
              Termos de Uso
            </a>
            .
          </p>
        </div>
        <div className="money-back">
          <h3>Garantia de devolução do dinheiro em 30 dias</h3>
          <p>
            Não está contente? Receba um reembolso completo dentro de 30 dias.
            Simples e fácil!
          </p>
        </div>
      </div>
    </div>
  );
}
