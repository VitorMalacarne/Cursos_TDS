import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";
import AuthService from "../Services/AuthService.js"; // Serviço de autenticação

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.post(formData.email, formData.password);
            if (response.status === 200) {
                const token = response.data.token;
                console.log("Token recebido:", token);

                // Armazena o token no localStorage
                localStorage.setItem("authToken", token);

                // Redireciona para a página inicial ou dashboard
                const redirectTo = localStorage.getItem('redirectAfterLogin') || "/"; // Caso não exista, redireciona para a home
                localStorage.removeItem('redirectAfterLogin'); // Limpar a URL armazenada após o redirecionamento

                navigate(redirectTo);
            } else {
                alert("Erro ao realizar login. Verifique suas credenciais.");
            }
        } catch (error) {
            console.error("Erro ao realizar login:", error.response?.data || error.message);
            alert(
                error.response?.data?.title ||
                "Erro ao realizar login. Verifique suas credenciais."
            );
        }
    };

    return (
        <div className="form-container">
            <img src={loginImage} alt="Imagem ilustrativa de login" className="form-image" />
            <div className="login">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Senha:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Entrar</button>
                </form>
                <div className="link-cadastro">
                    <p>Não tem uma conta? <span onClick={() => navigate("/signup")} style={{ cursor: "pointer", color: "blue" }}>Cadastre-se</span></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
