import "./Navbar2.css";
import { useNavigate } from "react-router-dom";
import logo_light from "../assets/logo_light.png";
import logo_dark from "../assets/logo_dark.png";
import img from "../assets/logo.png";
import DropdownMenu from "./DropdownMenu";

function Navbar2({ theme, setTheme }) {
    const navigate = useNavigate();

    const toggle_mode = () => {
        theme === "light" ? setTheme("dark") : setTheme("light");
    };

    // Verifica se o token JWT está presente no localStorage
    const jwtToken = localStorage.getItem("authToken");

    // Função para realizar logout
    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Remove o token do localStorage
        window.location.reload(); // Atualiza a página para refletir o logout
    };

    return (
        <div className="navbar">
            <img src={theme === "light" ? logo_light : logo_dark} alt="" className="logo" />

            <p>Explorar</p>

            <div className="search-box">
                <input type="text" placeholder="Search" />
                <div className="ico icon-search"></div>
            </div>

            {/* Renderiza com base na presença do token */}
            {jwtToken ? (
                <ul>
                    <li>Meu aprendizado</li>
                    <li><div className="ico icon-heart"></div></li>
                    <li><div className="ico icon-shopping-cart"></div></li>
                    <li><div className="ico icon-bell"></div></li>
                </ul>
            ) : (
                <div className="auth-buttons">
                    <button className="btn login-btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
                    <button className="btn signup-btn" onClick={() => navigate("/signup")}>
                        Cadastro
                    </button>
                </div>
            )}

            <div>
                {jwtToken && (
                    // <img
                    //     src={img}
                    //     className="perfil"
                    //     alt="Perfil"
                    //     onClick={handleLogout} // Adiciona o evento de logout
                    //     style={{ cursor: "pointer" }} // Mostra que a imagem é clicável
                    // />

                    <DropdownMenu />
                )}
            </div>
        </div>
    );
}

export default Navbar2;
