import "./Account.css";
import Collage from "../images/collage.jpeg";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useStoreContext } from "../context";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, genreList, setGenreList } = useStoreContext();

    async function loginByEmail(event) {
        event.preventDefault();
        try {
            const user = (await signInWithEmailAndPassword(auth, email, password)).user;
            setUser(user);
            //genres
            const docRef = doc(firestore, "users", user.email);
            const data = await getDoc(docRef);
            setGenreList(data.data().genreSorted);
            //login
            navigate(`/movies/genre/0`);
            alert('Successfully signed in.');
        } catch (error) {
            alert("Error signing in!");
        }
    }

  

    async function loginByGoogle() {
        try {
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            setUser(user);
            const docRef = doc(firestore, "users", user.email);
            const data = await getDoc(docRef);
            const genres = data.data().sortedGenres;
            navigate(`/movies/genre/0`);
        } catch (error) {
            console.log(error);
            alert("Google sign-in error.");
            // setUser(null);
            // signOut(auth);
        }
    }

  

    return (
        <div className="hero">
            <img src={Collage} alt="collage" id="hero-image"></img>
            <div className="shadow"></div>
            <div className="hero-frame">
                <div className="account-box">
                    <form onSubmit={(event) => loginByEmail(event)}>
                        <div className="account-title">Log In</div>
                        <label className="account-text">Email:</label>
                        <input className="account-input" type="email" value={email} onChange={(event) => { setEmail(event.target.value) }} required></input>
                        <label className="account-text">Password:</label>
                        <input className="account-input" type="password" value={password} onChange={(event) => { setPassword(event.target.value) }} required></input>
                        <label>Don't have an account? </label>
                        <label className="account-no" onClick={() => navigate("/register")}>Click here</label>
                        <button className="account-button" type="submit">LOGIN</button>
                    </form>
                    <button className="account-button" onClick={() => loginByGoogle()}>SIGN IN WITH GOOGLE</button>
                </div>
            </div>
        </div>
    )
}

export default Login;