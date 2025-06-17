import "./Account.css";
import Collage from "../images/collage.jpeg";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useStoreContext } from "../context";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from "firebase/firestore";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setGenreList } = useStoreContext();

    async function loginByEmail(event) {
        event.preventDefault();
        try {
            const user = (await signInWithEmailAndPassword(auth, email, password)).user;
            setUser(user);

            const docRef = doc(firestore, "users", user.email);
            const data = await getDoc(docRef);

            const genres = data.exists() && (data.data().genreSorted || data.data().genres) || [];
            console.log("📥 Genres retrieved from Firestore (Email):", genres);

            setGenreList(genres);

            if (genres.length === 0) {
                alert("No genres found. Please update your preferences.");
                navigate(`/movies`);
                return;
            }

            navigate(`/movies/genre/${genres[0].id}`);
            alert('Successfully signed in.');
        } catch (error) {
            alert("Error signing in!");
            console.error(error);
        }
    }

    async function loginByGoogle() {
    try {
        const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
        setUser(user);

        const docRef = doc(firestore, "users", user.email);
        const data = await getDoc(docRef);

        if (!data.exists()) {
            alert("You must register before logging in with this account.");
            await signOut(auth); // sign the user out
            setUser(null); // reset context
            return;
        }

        const genres = data.data().genreSorted || data.data().genres || [];
        console.log("📥 Genres retrieved from Firestore (Google):", genres);
        setGenreList(genres);

        if (genres.length === 0) {
            alert("No genres found. Please update your preferences.");
            navigate(`/movies`);
            return;
        }

        navigate(`/movies/genre/${genres[0].id}`);
    } catch (error) {
        alert("Google sign-in error.");
        console.error(error);
    }
}

    return (
        <div className="hero">
            <img src={Collage} alt="collage" id="hero-image" />
            <div className="shadow"></div>
            <div className="hero-frame">
                <div className="account-box">
                    <form onSubmit={loginByEmail}>
                        <div className="account-title">Log In</div>
                        <label className="account-text">Email:</label>
                        <input
                            className="account-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label className="account-text">Password:</label>
                        <input
                            className="account-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label>Don't have an account?</label>
                        <label className="account-no" onClick={() => navigate("/register")}>Click here</label>
                        <button className="account-button" type="submit">LOGIN</button>
                    </form>
                    <button className="account-button" onClick={loginByGoogle}>SIGN IN WITH GOOGLE</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
