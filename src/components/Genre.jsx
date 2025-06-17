import "./Genre.css";
import { useNavigate } from "react-router";
import { useStoreContext } from "../context";

function Genres() {
    const navigate = useNavigate();
    const { genreList } = useStoreContext();

    // Show loading or fallback if genres aren't ready yet
    if (!Array.isArray(genreList) || genreList.length === 0) {
        return <div className="genre-container">Loading genres...</div>;
    }

    return (
        <div className="genre-container">
            <label className="genre-title">Genres</label>
            {genreList.map((category) => (
                <button
                    key={category.id}
                    className="genre-list"
                    onClick={() => navigate(`genre/${category.id}`)}
                >
                    {category.genre}
                </button>
            ))}
        </div>
    );
}

export default Genres;
