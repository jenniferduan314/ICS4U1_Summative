import "./Settings.css";
import "./Register.css";
import Collage from "../images/collage.jpeg";
import { useStoreContext } from "../context";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { updateProfile, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { firestore } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";

function Settings() {
    const navigate = useNavigate();
    const { user, setUser, genreList, setGenreList, purchased } = useStoreContext();
    const nameArray = user.displayName.split(" ");
    const [fName, setfName] = useState(nameArray[0]);
    const [lName, setlName] = useState(nameArray[1]);
    const oldPass = useRef('');
    const newPass = useRef('');
    const conPass = useRef('');
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

    async function changeName(event) {
        event.preventDefault();
        if (fName == user.displayName.split(" ")[0] && lName == user.displayName.split(" ")[1]) {
            return alert("No changes were made.");
        }
        try {
            const currentUser = auth.currentUser;
            await updateProfile(currentUser, {
                displayName: `${fName} ${lName}`,
            });

            setUser((prevUser) => ({
                ...prevUser,
                displayName: `${fName} ${lName}`,
            }));

            alert("Name has been successfully changed!");
        } catch (error) {
            console.log(error);
            alert("Error updating first and last name");
        }
    }

    async function updateGenres() {
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
        const docRef = doc(firestore, "users", user.email);
        await setDoc(docRef, { sortedGenres: sortedGenres, previous: prevPurchases.toJS() });
        return alert("Changes have been saved.");
    }

    async function changePassword(event) {
        event.preventDefault();
        const currentUser = auth.currentUser;
        if (newPass.current.value != conPass.current.value) {
            return alert("Passwords do not match.")
        }

        try {
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                oldPass.current.value
            )
            await reauthenticateWithCredential(currentUser, credential);
        } catch (error) {
            return alert("Error changing password.");
        }

        try {
            await updatePassword(currentUser, newPass.current.value);
            oldPass.current.value = '';
            newPass.current.value = '';
            conPass.current.value = '';
            return alert("Password updated!");
        } catch (error) {
            return alert("Error changing password.");
        }
    }

    return (
        <div>
            <div className="hero">
                <img src={Collage} alt="collage" id="hero-image"></img>
                <div className="shadow"></div>
                <button className="settings-back" type="submit" onClick={() => navigate(`/movies/genre/${genreList[0].id}`)}>Back</button>
                <div className="register-box settings-box">
                    <div className="register-item">
                        <div className="account-title">Edit Profile</div>
                        <form onSubmit={(event) => changeName(event)}>
                            <label className="settings-text">First Name:</label>
                            <input className="account-input" type="text" value={fName} onChange={(event) => setfName(event.target.value)}></input>
                            <label className="settings-text">Last Name:</label>
                            <input className="account-input" type="text" value={lName} onChange={(event) => setlName(event.target.value)}></input>
                            <label className="settings-text">Email:</label>
                            <input className="account-input" type="email" value={user.email} readOnly></input>
                            <button className="settings-button" type="submit">Confirm Changes</button>
                        </form>
                        <form onSubmit={(event) => changePassword(event)}>
                            <label className="settings-text">Old Password</label>
                            <input className="account-input" type="password" ref={oldPass} required></input>
                            <label className="settings-text">New Password</label>
                            <input className="account-input" type="password" ref={newPass} required></input>
                            <label className="settings-text">Confirm New Password</label>
                            <input className="account-input" type="password" ref={conPass} required></input>
                            <button className="settings-button" type="submit">Change Password</button>
                        </form>
                    </div>
                    <div className="register-item">
                        <div className="account-genre">
                            <div className="account-title">Genre Selection</div>
                            <label>Please Select At Least 5 Genres</label>
                        </div>
                        {genres.map((item) => {
                            const isSelected = genreList.some(genre => genre.id == item.id);
                            return (
                                <div className="account-genres" key={item.id}>
                                    <input className="account-genres" type="checkbox" id="check" defaultChecked={isSelected} ref={(el) => (checkboxesRef.current[item.id] = el)} />
                                    <label className="account-genres">{item.genre}</label>
                                </div>
                            )
                        })}
                        <button className="settings-genre" onClick={() => updateGenres()}>Save Changes</button>
                    </div>
                </div>
            </div>
            <div className="settings-purchase-box">
                <div className="settings-purchase-frame">
                    <div className="account-title"> Purchase History </div>
                    <div className="purchases">
                        {purchased.entrySeq().map(([key, value]) => {
                            return (
                                <div className="purchase-items" key={key}>
                                    <div className="purchase-item">
                                        <img src={`https://image.tmdb.org/t/p/w500${value.poster}`} width={"200px"} />
                                        <label className="purchase-movie">{value.title}</label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;