import "../css/NotFoundPage.css"
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="error-container">
        <div className="glitch-wrapper">
            <div className="glitch" data-text="404">
                Not Found 404
            </div>
        </div>

        <div className="error-content">
            <div className="pixel-art">
            <div className="ghost">
                <div className="ghost-body">
                <div className="ghost-eyes">
                    <div className="eye left"></div>
                    <div className="eye right"></div>
                </div>
                </div>
                <div className="ghost-tail">
                <div className="tail"></div>
                <div className="tail"></div>
                <div className="tail"></div>
                </div>
            </div>
            </div>

            <a href="/" className="retry-button" onClick={navigate("/")}>
            Voltar ao aprendizado
            <span className="blink">_</span>
            </a>
        </div>
        </div>
    )
}

export default NotFoundPage;