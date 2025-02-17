import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../Services/UserService";

function DropdownMenu({ userName = "John Doe" }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [isTeacher, setIsTeacher] = useState(false);

    const jwtToken = localStorage.getItem("authToken");

    useEffect(() => {
            if (jwtToken) {
                UserService.getUser()  // Certifique-se de que o método getUser() está implementado corretamente no seu UserService
                    .then((response) => {
                        const user = response.data; // O objeto de resposta geralmente está em `data`
                        if(user.role == "Teacher"){setIsTeacher(true)} // Atualiza o estado com o nome do usuário
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar dados do usuário", error);
                    });
            }
        }, [jwtToken]);

    // Função para extrair as iniciais
    const getInitials = (name) => {
        const parts = name.split(" ");
        if (parts.length > 1) {
            return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Funções para os itens de dropdown
    const handleMyLearning = () => {
        navigate("/mylearning");
    };

    const handleMyCart = () => {
        navigate("/cart");
    };

    const handleWishlist = () => {
        navigate("/wishlist");
    };

    const handleTeachOnLearnNest = () => {
        if(isTeacher){
            navigate("/teachercoursemanagement");
        } else{
            navigate("/teachermain");
        }
    };

    const handleNotifications = () => {
        console.log("Notificações clicadas");
    };

    const handleMessages = () => {
        console.log("Mensagens clicadas");
    };

    const handleSettings = () => {
        console.log("Configurações clicadas");
    };

    const handlePurchaseHistory = () => {
        console.log("Histórico de compras clicado");
    };

    const handleHelpAndSupport = () => {
        console.log("Ajuda e suporte clicado");
    };

    const handleLogout = () => {
        console.log("Sair clicado");
        // Aqui você pode realizar o logout, como remover o token do localStorage
        localStorage.removeItem("authToken");
        window.location.reload(); // Atualiza a página para refletir o logout
    };

    return (
        <div className="drop-container">
            <div className="drop-trigger" onClick={() => setOpen(!open)}>
                <div className="perfil">
                    <h2>{getInitials(userName)}</h2>
                </div>

                <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
                    <h3>{userName}</h3>
                    <ul>
                        <DropdownItem text="Meu aprendizado" onClick={handleMyLearning} />
                        <DropdownItem text="Meu carrinho" onClick={handleMyCart} />
                        <DropdownItem text="Lista de desejos" onClick={handleWishlist} />
                        <DropdownItem text="Ensine no LearnNest" onClick={handleTeachOnLearnNest} />
                        {/* <DropdownItem text="Notificações" onClick={handleNotifications} />
                        <DropdownItem text="Mensagens" onClick={handleMessages} />
                        <DropdownItem text="Configurações" onClick={handleSettings} />
                        <DropdownItem text="Histórico de compra" onClick={handlePurchaseHistory} />
                        <DropdownItem text="Ajuda e suporte" onClick={handleHelpAndSupport} /> */}
                        <DropdownItem text="Sair" onClick={handleLogout} />
                    </ul>
                </div>
            </div>
        </div>
    );
}

function DropdownItem({ text, onClick }) {
    return (
        <li className="drop-item" onClick={onClick}>
            <a>{text}</a>
        </li>
    );
}

export default DropdownMenu;