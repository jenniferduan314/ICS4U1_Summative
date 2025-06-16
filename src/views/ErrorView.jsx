import { useNavigate } from "react-router";
import Errorcat from "../images/catwink.png";
import "./ErrorView.css";

function ErrorView() {
    const navigate = useNavigate();

    return (
        <div className="error-container">
            <h1 className="error-title">404 MEOW-RROR</h1>
            <h2 className="error-subtitle">Page Not Found</h2>
            <div><img src={Errorcat} alt="Error Cat" width="350" id="Error" /></div>
            <p className="error-message">
                It looks like the page you're looking for doesn't exist or has been moved!  
            </p>
            
            <button 
                className="error-button" 
                onClick={() => navigate("/")}
            >
                Return Home
            </button>
        </div>
    )
}

export default ErrorView;