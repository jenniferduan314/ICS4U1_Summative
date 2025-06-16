import "./Feature.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Features() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        (async function getMovies() {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
            );
            setMovies(response.data.results);
            console.log(response.data.results);
        })();
    }, []);

    return (
        <div>
            <div className="feature-title">
                <h2>☆☆☆ ─── FEATURING ─── ☆☆☆</h2>
            </div>
            {movies.length > 0 ? (
                <div className="feature">
                    <div className="feature-flex">
                        <img className="feature-image" src={`https://image.tmdb.org/t/p/w500${movies[Math.floor(Math.random() * 5)].poster_path}`} />
                    </div>
                    <div className="feature-flex">
                        <img className="feature-image" src={`https://image.tmdb.org/t/p/w500${movies[Math.floor(Math.random() * 5 + 5)].poster_path}`} />
                    </div>
                    <div className="feature-flex">
                        <img className="feature-image" src={`https://image.tmdb.org/t/p/w500${movies[Math.floor(Math.random() * 5 + 10)].poster_path}`} />
                    </div>
                    <div className="feature-flex">
                        <img className="feature-image" src={`https://image.tmdb.org/t/p/w500${movies[Math.floor(Math.random() * 5 + 15)].poster_path}`} />
                    </div>
                </div>
            ) : (
                <p>Movies Loading...</p>
            )}
        </div>
    )
}

export default Features;