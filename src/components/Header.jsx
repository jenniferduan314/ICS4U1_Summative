import "./Header.css";
import MeowMovies from "../images/weblogo.png";
import Search from "../images/search.png";
import { useNavigate } from "react-router";
import { useStoreContext } from "../context";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";


function Header() {
    const navigate = useNavigate();
    const { firstName, loggedIn, setLoggedIn, setUser, setGenreList } = useStoreContext();
    const [searchTerm, setSearchTerm] = useState("");

    async function logout() {
    try {
        await signOut(auth);  // Wait for Firebase to sign out
        setUser(null);
        setGenreList([]);
        setLoggedIn(false);  
        navigate(`/`);        // Redirect to home page
    } catch (error) {
        console.error("Error signing out:", error);
        alert("Failed to sign out. Please try again.");
    }
}


    function handleSearch(e) {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
            setSearchTerm(""); // Optional: clear input after search
        }
    }

    return (
        <div className="header">
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&family=Staatliches&display=swap" rel="stylesheet" />

            <div>
                <img src={MeowMovies} alt="Meow Movies" onClick={() => logout()} width="150" id="logo" />
                <div className="header-text" onClick={() => logout()}>
                    <div className="webtitle">「MEOW MOVIES!」</div>
                </div>
            </div>

            <div className="header-frame">
    <div>
        {loggedIn && (
            <>
                <label className="welcome-message">Welcome {firstName}!</label>
                <div className="sign-in">
                    <button className="signed-buttons" onClick={() => navigate(`/cart`)}>Cart</button>
                    <button className="signed-buttons" onClick={() => logout()}>Sign Out</button>
                    <button className="signed-buttons" onClick={() => navigate(`/settings`)}>Settings</button>
                </div>
            </>
        )}
    </div>

    {loggedIn && (
        <form className="search-container" onSubmit={handleSearch}>
            <input
                type="text"
                id="search-bar"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button id="search-button" type="submit">
                <img src={Search} alt="search button" height="30" />
            </button>
        </form>
    )}
</div>

        </div>
    );
}

export default Header;
