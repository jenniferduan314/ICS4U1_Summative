import "./AllMovie.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useStoreContext } from "../context";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Map } from 'immutable';

function AllMovies() {
    const { user, cart, setCart, purchased } = useStoreContext();
    const [movies, setMovies] = useState([]);
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        async function getMovies() {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${id}&page=${page}`
            );
            setMovies(response.data.results);
            setTotalPages(response.data.total_pages, 20);
        } getMovies();
    }, [id, page]);

    useEffect(() => {
        setPage(1);
    }, [id]);

    function PrevPage() {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    function NextPage() {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }

    function Details(id) {
        navigate(`/movies/details/${id}`);
    }
    
    function buttonText(movie) {
        if (purchased.has(String(movie))) {
            return "Purchased";
        } else if (cart.has(String(movie))) {
            return "Added";
        } else {
            return "Buy";
        };
    }

    const addToCart = (id, title, poster) => {
        if (purchased.has(id + "")) {
          //cannot add an item that has already been purchased
          return;
        }
    
        if (cart.has(id + "")) {
          //cannot add an item that has already been added
          return;
        }
        
        const movieDetails = {
            title,
            poster,
        };
        
        setCart((prevCart) => {
          const cart = prevCart.set(String(id), movieDetails);
          localStorage.setItem(user.uid, JSON.stringify(cart.toJS()));
          return cart;
        });
    }

    return (
        <div className="movies-container">
            {movies.map((movie) => (
                <div key={movie.id} className="movie">
                    <div className="movie-box">
                        <img className="movie-poster" onClick={() => Details(movie.id)} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}></img>
                        <button className="movie-buy" onClick={() => addToCart(movie.id, movie.original_title, movie.poster_path)}> {buttonText(movie.id)} </button>
                    </div>
                </div>

            ))}
            <div className="movies-pages">
                <label className="movies-numbers">Page: {page} / {totalPages}</label>
                <div>
                    <button className="movies-buttons" onClick={() => PrevPage()}>Previous Page</button>
                    <button className="movies-buttons" onClick={() => NextPage()}>Next Page</button>
                </div>
            </div>
        </div>
    )
}

export default AllMovies;