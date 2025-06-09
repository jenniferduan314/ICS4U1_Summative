import "./Genre.css";
import { useNavigate } from "react-router";

function Genres(prop) {
    const navigate = useNavigate();

    return (
        <div className="genre-container">
            <label className="genre-title">Genres</label>
            {prop.genres.map((category) => (
                <button key={category.id} className="genre-list" onClick={() => navigate(`genre/${category.id}`)}>{category.genre}</button>
            ))}
        </div>
    )
}


export default Genres;