import "./Account.css";
import "./Register.css";
import Collage from "../images/collage.jpeg";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { firestore } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Register() {
    const navigate = useNavigate();
    const { setUser, genreList, setGenreList, setLoggedIn, loggedIn } = useStoreContext();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePass, setRePass] = useState('');
    const checkboxesRef = useRef({});
    const genres = [
        { id: 28, genre: "Action" },
        { id: 12, genre: "Adventure" },
        { id: 16, genre: "Animation" },
        { id: 35, genre: "Comedy" },
        { id: 80, genre: "Crime" },
        { id: 10751, genre: "Family" },
        { id: 14, genre: "Fantasy" },
        { id: 36, genre: "History" },
        { id: 27, genre: "Horror" },
        { id: 10402, genre: "Music" },
        { id: 9648, genre: "Mystery" },
        { id: 878, genre: "Sci-Fi" },
        { id: 53, genre: "Thriller" },
        { id: 10752, genre: "War" },
        { id: 37, genre: "Western" }
    ]

    const registerByEmail = async (event) => {
        event.preventDefault();
        try {
            if (password != rePass) {
                return alert("Passwords do not match. Please ensure your passwords match.");
            }

            const genreSelected = Object.keys(checkboxesRef.current)
                .filter((genreId) => checkboxesRef.current[genreId].checked)
                .map(Number);

            if (genreSelected.length < 5) {
                return alert("Please select at least 5 genres.");
            }

            const genreSorted = genreSelected
                .map((genreId) => genres.find((genre) => genre.id === genreId))
                .sort((a, b) => a.genre.localeCompare(b.genre));
            //adding user
            const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
            await updateProfile(user, { displayName: `${firstName} ${lastName}` });
            setUser(user);
            //storing genres
            setGenreList(genreSorted);
            const docRef = doc(firestore, "users", user.email);
            const userData = { genres: genreSorted };
            await setDoc(docRef, userData, { merge: true });
            //registered
            navigate(`/movies/genre/${genreSorted[0]}`);
            alert("Account Created.");
        } catch (error) {
            console.log(error);
            alert("Error creating user with email and password.");
        }
    }

    const registerByGoogle = async () => {
        console.log('hi');
        try {
            if (password != rePass) {
                return alert("Passwords do not match. Please ensure your passwords match.");
            }

            const genreSelected = Object.keys(checkboxesRef.current)
                .filter((genreId) => checkboxesRef.current[genreId].checked)
                .map(Number);

            if (genreSelected.length < 5) {
                return alert("Please select at least 5 genres.");
            }

            const genreSorted = genreSelected
                .map((genreId) => genres.find((genre) => genre.id === genreId))
                .sort((a, b) => a.genre.localeCompare(b.genre));

            //adding user
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            const docRef = doc(firestore, "users", user.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.googleAccount) {
                    // If the user is already registered via Google
                    alert("You have already registered with Google.");
                    signOut(auth);
                    setUser(null);
                    return;
                } else {
                    // If the user is trying to register via Google but their email is already in use by an email/password registration
                    alert("This email is already associated with an existing account. Please log in using your email and password.");
                    signOut(auth);
                    setUser(null);
                    return;
                }
            } else {
                console.log('hi');
                setUser(user);
                setLoggedIn(true);
                //storing genres
                setGenreList(genreSorted);
                const userData = { genres: genreSorted };
                await setDoc(docRef, userData, { merge: true });
                //registered
                navigate(`/movies/genre/${genreSorted[0]}`);
                alert("Account Created.");
            }
        } catch (error) {
            console.log(error);
            alert("Error creating user with email and password!");
        }
    }

    return (
        <div className="hero">
            <img src={Collage} alt="collage" id="hero-image"></img>
            <div className="shadow"></div>
            <div className="register-box">
                <div className="register-item">
                    <div className="account-title">Create Account</div>
                    <form onSubmit={(event) => registerByEmail(event)}>
                        <label className="account-text">First Name:</label>
                        <input className="account-input" type="text" value={firstName} onChange={(event) => { setFirstName(event.target.value) }} required></input>
                        <label className="account-text">Last Name:</label>
                        <input className="account-input" type="text" value={lastName} onChange={(event) => { setLastName(event.target.value) }} required></input>
                        <label className="account-text">Email:</label>
                        <input className="account-input" type="email" value={email} onChange={(event) => { setEmail(event.target.value) }} required></input>
                        <label className="account-text">Password:</label>
                        <input className="account-input" type="password" value={password} onChange={(event) => { setPassword(event.target.value) }} required></input>
                        <label className="account-text">Re-enter Password:</label>
                        <input className="account-input" type="password" value={rePass} onChange={(event) => { setRePass(event.target.value) }} required></input>
                        <label>Already have an account? </label>
                        <label className="account-no" onClick={() => navigate("/login")}>Click here</label>
                        <button className="account-button" type="submit">CREATE</button>
                    </form>
                    <button className="account-button" onClick={() => registerByGoogle()}>REGISTER WITH GOOGLE</button>
                </div>
                <div className="register-item">
                    <div className="account-genre">
                        <div className="account-title">Genre Selection</div>
                        <label>Please Select At Least 5 Genres</label>
                    </div>
                    {genres.map((item) => (
                        <div className="account-genres" key={item.id}>
                            <input className="account-genres" type="checkbox" id="check" ref={(el) => (checkboxesRef.current[item.id] = el)} />
                            <label className="account-genres">{item.genre}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Register;