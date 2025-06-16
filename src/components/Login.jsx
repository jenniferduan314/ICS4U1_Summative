import "./Account.css";
import Collage from "../images/collage.jpeg";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useStoreContext } from "../context";

function Login() {
    const { email, password, setLoggedIn, genreList } = useStoreContext();
    const [ema, setEma] = useState("")
    const [pass, setPass] = useState("");
    const navigate = useNavigate();

    function log(event) {
        event.preventDefault();
        if (ema == email && pass == password) {
            setLoggedIn(true);
            localStorage.setItem("user", "true");
            return navigate(`/movies/genre/${genreList[0].id}`);
        } else {
            localStorage.setItem("user", "false");
        }
    }

    return (
        <div className="hero">
            <img src={Collage} alt="collage" id="hero-image"></img>
            <div className="shadow"></div>
            <div className="hero-frame">
                <div className="account-box">
                    <form onSubmit={(event) => log(event)}>
                        <div className="account-title">Log In</div>
                        <label className="account-text">Email:</label>
                        <input className="account-input" type="email" value={ema} onChange={(event) => { setEma(event.target.value) }} required></input>
                        <label className="account-text">Password:</label>
                        <input className="account-input" type="password" value={pass} onChange={(event) => { setPass(event.target.value) }} required></input>
                        <label>Don't have an account? </label>
                        <label className="account-no" onClick={() => navigate("/register")}>Click here</label>
                        <button className="account-button" type="submit">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;