import "./Account.css";
import "./Register.css";
import Collage from "../images/collage.jpeg";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useStoreContext } from "../context";
import { Map } from 'immutable';

function Register() {
    const navigate = useNavigate();
    const { setFirstName, setLastName, setEmail, setPassword, genreList, setGenreList, setLoggedIn, setCart } = useStoreContext();
    const firstName = useRef('');
    const lastName = useRef('');
    const email = useRef('');
    const password = useRef('');
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

    function create(event) {
        event.preventDefault();
        if (password.current.value != rePass) {
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

        setFirstName(firstName.current.value);
        setLastName(lastName.current.value);
        setEmail(email.current.value);
        setPassword(password.current.value);
        setGenreList(genreSorted);
        setCart(Map());
        setLoggedIn(true);
        localStorage.setItem("user", "true");
        return navigate(`/movies/genre/${genreSorted[0].id}`);
    }

    return (
        <div className="hero">
            <img src={Collage} alt="collage" id="hero-image"></img>
            <div className="shadow"></div>
            <div className="register-box">
                <div className="register-item">
                    <div className="account-title">Create Account</div>
                    <form onSubmit={(event) => create(event)}>
                        <label className="account-text">First Name:</label>
                        <input className="account-input" type="text" ref={firstName} required></input>
                        <label className="account-text">Last Name:</label>
                        <input className="account-input" type="text" ref={lastName} required></input>
                        <label className="account-text">Email:</label>
                        <input className="account-input" type="email" ref={email} required></input>
                        <label className="account-text">Password:</label>
                        <input className="account-input" type="password" ref={password} required></input>
                        <label className="account-text">Re-enter Password:</label>
                        <input className="account-input" type="password" value={rePass} onChange={(event) => { setRePass(event.target.value) }} required></input>
                        <label>Already have an account? </label>
                        <label className="account-no" onClick={() => navigate("/login")}>Click here</label>
                        <button className="account-button" type="submit">CREATE</button>
                    </form>
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
                                id="check"
                                defaultChecked={genreList.some((genre) => genre.id === item.id)}
                                ref={(el) => (checkboxesRef.current[item.id] = el)}
                            />
                            <label className="account-genres">{item.genre}</label>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Register;