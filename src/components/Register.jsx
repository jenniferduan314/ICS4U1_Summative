import "./Account.css";
import Collage from "../images/collage.jpeg";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useStoreContext } from "../context";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, genreList } = useStoreContext();

    async function registerByEmail(event) {
        event.preventDefault();
        try {
            const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
            setUser(user);

            // Save genres under consistent key
            const genreSorted = [...genreList];
            const docRef = doc(firestore, "users", user.email);
            await setDoc(docRef, { genreSorted }, { merge: true });

            navigate(`/movies/genre/${genreSorted[0].id}`);
            alert("Registered successfully!");
        } catch (error) {
            alert("Error creating user.");
            console.error(error);
        }
    }

    async function registerByGoogle() {
        try {
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            setUser(user);

            const docRef = doc(firestore, "users", user.email);
            const data = await getDoc(docRef);

            let genreSorted = [...genreList];

            if (!data.exists()) {
                await setDoc(docRef, { genreSorted }, { merge: true });
            } else if (!data.data().genreSorted) {
                await setDoc(docRef, { genreSorted }, { merge: true });
            } else {
                genreSorted = data.data().genreSorted;
            }

            navigate(`/movies/genre/${genreSorted[0].id}`);
        } catch (error) {
            alert("Google registration error.");
            console.error(error);
        }
    }

    return (
        <div className="hero">
            <img src={Collage} alt="collage" id="hero-image" />
            <div className="shadow"></div>
            <div className="hero-frame">
                <div className="account-box">
                    <form onSubmit={registerByEmail}>
                        <div className="account-title">Register</div>
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
                        <label>Already have an account?</label>
                        <label className="account-no" onClick={() => navigate("/login")}>Click here</label>
                        <button className="account-button" type="submit">REGISTER</button>
                    </form>
                    <button className="account-button" onClick={registerByGoogle}>SIGN UP WITH GOOGLE</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
