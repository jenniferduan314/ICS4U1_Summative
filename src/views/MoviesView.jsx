import Header from "../components/Header.jsx";
import Genre from "../components/Genre.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { useStoreContext } from '../context';
import "./MoviesView.css";


function Movies() {
    const { genreList } = useStoreContext();

    return (
        <div>
            <Header />
            <div className="movie-section">
                <Genre genres={genreList} />
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Movies;