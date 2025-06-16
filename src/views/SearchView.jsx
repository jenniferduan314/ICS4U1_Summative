import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchView.css";

function SearchView() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get("query") || "";

    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setPage(1); // reset to page 1 on new search
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/search/movie?query=${debouncedQuery}&page=${page}&api_key=${import.meta.env.VITE_TMDB_KEY}`
                );
                const data = await res.json();
                setResults(data.results || []);
                setTotalPages(data.total_pages);
            } catch (err) {
                console.error("Search error:", err);
            }
        };

        fetchResults();
    }, [debouncedQuery, page]);

    return (
        <div className="search-view">
            <button className="search-back" onClick={() => navigate(-1)}>Back</button>
            <input
                type="text"
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a movie..."
            />
            <div className="search-results">
                {results.map((movie) => (
                    <div key={movie.id} className="search-result" onClick={() => navigate(`/movies/details/${movie.id}`)}>
                        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                        <label>{movie.title}</label>
                    </div>
                ))}
            </div>

            {results.length > 0 && (
                <div className="search-pagination">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="pagination-button"
                    >
                        Previous
                    </button>
                    <span className="page-number">{page} / {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="pagination-button"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchView;
