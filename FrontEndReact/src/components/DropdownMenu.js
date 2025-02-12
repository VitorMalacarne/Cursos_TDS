import { useState } from "react";

function DropdownMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="drop-container">
            <div className="drop-trigger" onClick={() => {setOpen(!open)}}>
                <div className="perfil">
                    <h2>JU</h2>
                </div>

                <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
                    <h3>Sla</h3>
                    <ul>
                        <DropdownItem text="Meu aprendizado" />
                        <DropdownItem text="Meu carrinho" />
                        <DropdownItem text="Lista de desejos" />
                        <DropdownItem text="Ensine no LearnNest" />
                        <DropdownItem text="Notificações" />
                        <DropdownItem text="Mensagens" />
                        <DropdownItem text="Configurações" />
                        <DropdownItem text="Histórico de compra" />
                        <DropdownItem text="Ajuda e suporte" />
                        <DropdownItem text="Sair" />
                    </ul>
                </div>
            </div>
        </div>
    );
}

function DropdownItem(props) {
    return (
        <li className="drop-item">
            {/* <img src={props.img} /> */}
            <a>{props.text}</a>
        </li>
    );
}

export default DropdownMenu;
