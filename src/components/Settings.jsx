import "./Settings.css";
import Collage from "../images/collage.jpeg";
import { useStoreContext } from "../context";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";

function Settings() {
    const navigate = useNavigate();
    const { firstName, setFirstName, lastName, setLastName, email, genreList, setGenreList } = useStoreContext();
    const [fName, setFName] = useState(firstName);
    const [lName, setLName] = useState(lastName);
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
    console.log("Current genreList:", genreList);


    function changeName(event) {
        event.preventDefault();
        if (fName == firstName && lName == lastName) {
            return alert("No changes were made.");
        }
        setFirstName(fName);
        setLastName(lName);
        alert("Changes have been saved.");
    }

    function updateGenres() {
        const genreSelected = Object.keys(checkboxesRef.current)
            .filter((genreId) => checkboxesRef.current[genreId].checked)
            .map(Number);

        if (genreSelected.length < 5) {
            return alert("Please select at least 5 genres.");
        }

        const genreSorted = genreSelected
            .map((genreId) => genres.find((genre) => genre.id === genreId))
            .sort((a, b) => a.genre.localeCompare(b.genre));

        setGenreList(genreSorted);
        return alert("Changes have been saved.");
    }

    return (
        <div className="hero">
            <img src={Collage} alt="collage" id="hero-image"></img>
            <div className="shadow"></div>
            <div className="register-box">
            <button className="settings-back" type="submit" onClick={() => navigate(`/movies/genre/${genreList[0].id}`)}>Back</button>
                <div className="register-item">
                    <div className="account-title">Edit Profile</div>
                    <form onSubmit={(event) => changeName(event)}>
                        <label className="account-text">First Name:</label>
                        <input className="account-input" type="text" value={fName} onChange={(event) => setFName(event.target.value)}></input>
                        <label className="account-text">Last Name:</label>
                        <input className="account-input" type="text" value={lName} onChange={(event) => setLName(event.target.value)}></input>
                        <label className="account-text">Email:</label>
                        <input className="account-input" type="email" value={email} readOnly></input>
                        <button className="settings-button" type="submit">Confirm Changes</button>
                    </form>
                </div>
                <div className="register-item">
                    <div className="account-genre">
                        <div className="account-title">Genre Selection</div>
                        <label>Please Select At Least 5 Genres</label>
                    </div>
                    {genres.map((item) => (
                        <div className="account-genres" key={item.id}>
                            <input className="account-genres"type="checkbox"id="check"ref={(el) => (checkboxesRef.current[item.id] = el)}defaultChecked={genreList.some((genre) => genre.id === item.id)}
                            />

                            <label className="account-genres">{item.genre}</label>
                        </div>
                    ))}
                    <button className="settings-genre" onClick={() => updateGenres()}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}

export default Settings;