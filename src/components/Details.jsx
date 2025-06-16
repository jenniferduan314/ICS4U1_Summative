import "./Details.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Details() {
    const [movie, setMovie] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getDetails() {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=videos`
            );
            console.log(response.data);
            setMovie(response.data);
        }
        getDetails();
    }, [id]);

    return (
        <div className="details-movie">
             <button className="details-back" onClick={() => navigate(-1)}>Back</button>
            <h1 className="details-title">☆⋅ {movie.title} ⋅☆</h1>
            <h3 className="details-tagline">{movie.tagline}</h3>
            <p className="details-overview">{movie.overview}</p>
            <div className="details-info">
                <p><strong>Release Date: </strong>{movie.release_date}</p>
                <p><strong>Runtime: </strong>{movie.runtime} minutes</p>
                <p><strong>Revenue: </strong>$ {movie.revenue}</p>
                <p><strong>Originated from: </strong>{movie.origin_country}</p>
                <p><strong>Watcher Rating: </strong>{movie.vote_average}</p>
            </div>
            <img id="poster" width="300px" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
            <div className="trailers-section">
                <h2>⋆⋅☆⋅ Trailers ⋅☆⋅⋆</h2>
                <div className="trailers-grid">
                    {movie.videos && movie.videos.results
                        .filter(trailer => trailer.type === 'Trailer')
                        .map((trailer) => (
                            <div key={trailer.id} className="trailer-tile">
                                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank">
                                    <img
                                        className="trailer-thumbnail"
                                        src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                                        alt={trailer.name}
                                    />
                                </a>
                            </div>
                        ))}
                </div>
                
            </div>
            
            
        </div>
    )
}

export default Details;