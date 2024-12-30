import "./Navbar.css"
import logo_light from"../assets/logo_light.png"
import logo_dark from"../assets/logo_dark.png"


function Navbar({theme, setTheme}){
    const toggle_mode = () => {
        theme === "light" ? setTheme("dark") : setTheme("light");
    }

    return(
        <div className="navbar">
            <img src={theme === "light" ? logo_light : logo_dark} alt="" className="logo"/>
            <ul>
                <li>Home</li>
                <li>Products</li>
                <li>Features</li>
                <li>About</li>
            </ul>

            <div className="search-box">
                <input type="text" placeholder="Search"/>
                <div className='ico icon-search'></div>
            </div>

            <div onClick={() => {toggle_mode()}} className='ico icon-contrast toggle'></div>
        </div>
    );
}

export default Navbar;