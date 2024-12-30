import "./Navbar2.css"
import logo_light from "../assets/logo_light.png"
import logo_dark from "../assets/logo_dark.png"
import img from "../assets/logo.png"

function Navbar2({ theme, setTheme }) {
    const toggle_mode = () => {
        theme === "light" ? setTheme("dark") : setTheme("light");
    }

    return (
        <div className="navbar">
            <img src={theme === "light" ? logo_light : logo_dark} alt="" className="logo" />

            <p>Explorar</p>

            <div className="search-box">
                <input type="text" placeholder="Search" />
                <div className='ico icon-search'></div>
            </div>

            <ul>
                <li>Meu aprendizado</li>
                <li><div className="ico icon-heart"></div></li>
                <li><div className="ico icon-shopping-cart"></div></li>
                <li><div className="ico icon-bell"></div></li>
            </ul>

            <div>
                <img src={img} className="perfil"></img>
            </div>
        </div>
    );
}

export default Navbar2;