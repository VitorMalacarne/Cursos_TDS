import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signup from "../assets/signup.png";
import UserController from "../Services/UserService.js";
import AuthService from "../Services/AuthService.js"; // Serviço de autenticação

function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        cpf: "",
        password: "",
        role: "Student",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await UserController.save(formData);
            if (response.status === 201) {
                alert("Usuário cadastrado com sucesso!");

                // Após cadastro, realizar o login automaticamente
                try {
                    console.log(formData);
                    const loginResponse = await AuthService.post(
                        formData.email,
                        formData.password
                    );

                    console.log(loginResponse);

                    if (loginResponse.status === 200) {
                        // Armazenar o token (se houver)
                        const token = loginResponse.data.token;
                        console.log(token);
                        localStorage.setItem("authToken", token);

                        // Redirecionar para a página inicial ou dashboard
                        navigate("/");
                    } else {
                        console.log("entrou");
                        alert("Erro ao realizar login. Tente fazer login manualmente.");
                    }
                } catch (loginError) {
                    console.error("Erro ao fazer login:", loginError.response?.data || loginError.message);
                    alert(
                        loginError.response?.data?.title || "Erro ao realizar login. Verifique suas credenciais."
                    );
                    console.log("Detalhes dos erros:", loginError.response?.data?.errors);
                }
            } else {
                alert("Erro ao cadastrar usuário.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
        }
    };

    return (
        <div className="form-container">
            <img src={signup} alt="Imagem ilustrativa" className="form-image" />
            <div className="cadastro">
                <h2>Cadastro de Usuário</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Telefone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
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
                        <label>CPF:</label>
                        <input
                            type="text"
                            name="cpf"
                            value={formData.cpf}
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
                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
