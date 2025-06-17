import "./Account.css";
import "./Register.css";
import Collage from "../images/collage.jpeg";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    signOut,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function Register() {
    const navigate = useNavigate();
    const { setUser, setGenreList } = useStoreContext();

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
    ];

    const getSelectedGenres = () => {
        const selectedIds = Object.keys(checkboxesRef.current)
            .filter((id) => checkboxesRef.current[id]?.checked)
            .map(Number);

        if (selectedIds.length < 5) {
            alert("Please select at least 5 genres.");
            return null;
        }

        return selectedIds
            .map(id => genres.find(g => g.id === id))
            .sort((a, b) => a.genre.localeCompare(b.genre));
    };

    const registerByEmail = async (event) => {
        event.preventDefault();
        if (password !== rePass) {
            return alert("Passwords do not match.");
        }

        const genreSorted = getSelectedGenres();
        if (!genreSorted) return;

        try {
            const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
            await updateProfile(user, { displayName: `${firstName} ${lastName}` });
            setUser(user);

            setGenreList(genreSorted);
            const docRef = doc(firestore, "users", user.email);
            await setDoc(docRef, { genreSorted }, { merge: true });

            if (!genreSorted[0]?.id) {
                navigate(`/movies`);
            } else {
                navigate(`/movies/genre/${genreSorted[0].id}`);
            }
            alert("Account created successfully.");
        } catch (error) {
            console.error(error);
            alert("Error creating account.");
        }
    };

    const registerByGoogle = async () => {
        if (password !== rePass) {
            return alert("Passwords do not match.");
        }

        const genreSorted = getSelectedGenres();
        if (!genreSorted) return;

        try {
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            const docRef = doc(firestore, "users", user.email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                alert("Google account already registered.");
                signOut(auth);
                setUser(null);
                return;
            }

            setUser(user);
            setGenreList(genreSorted);
            await setDoc(docRef, { genreSorted }, { merge: true });

            if (!genreSorted[0]?.id) {
                navigate(`/movies`);
            } else {
                navigate(`/movies/genre/${genreSorted[0].id}`);
            }
            alert("Account created with Google.");
        } catch (error) {
            console.error(error);
            alert("Google registration failed.");
        }
    };

    return (
        <div className="hero">
            <img src={Collage} alt="collage" id="hero-image" />
            <div className="shadow"></div>
            <div className="register-box">
                <div className="register-item">
                    <div className="account-title">Create Account</div>
                    <form onSubmit={registerByEmail}>
                        <label className="account-text">First Name:</label>
                        <input className="account-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <label className="account-text">Last Name:</label>
                        <input className="account-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        <label className="account-text">Email:</label>
                        <input className="account-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label className="account-text">Password:</label>
                        <input className="account-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <label className="account-text">Re-enter Password:</label>
                        <input className="account-input" type="password" value={rePass} onChange={(e) => setRePass(e.target.value)} required />
                        <label>Already have an account?</label>
                        <label className="account-no" onClick={() => navigate("/login")}>Click here</label>
                        <button className="account-button" type="submit">CREATE</button>
                    </form>
                    <button className="account-button" onClick={registerByGoogle}>REGISTER WITH GOOGLE</button>
                </div>
                <div className="register-item">
                    <div className="account-genre">
                        <div className="account-title">Genre Selection</div>
                        <label>Please Select At Least 5 Genres</label>
                    </div>
                    {genres.map((item) => (
                        <div className="account-genres" key={item.id}>
                            <input
                                className="account-genres"
                                type="checkbox"
                                ref={(el) => (checkboxesRef.current[item.id] = el)}
                            />
                            <label className="account-genres">{item.genre}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Register;
