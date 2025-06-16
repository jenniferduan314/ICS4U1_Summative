import "./Cart.css";
import { useNavigate } from "react-router";
import { useStoreContext } from "../context";

function Cart() {
    const navigate = useNavigate();
    const { cart, setCart, genreList } = useStoreContext();

    return (
        <div className="cart">
            <button className="cart-back" onClick={() => navigate(-1)}>Back</button>
            <label className="cart-title">Cart</label>
            <div className="cart-items">
                {
                    cart.entrySeq().map(([key, movie]) => {
                        return (
                            <div className="cart-item" key={key}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.url}`} width={"250px"} />
                                <label className="cart-movie">{movie.title}</label>
                                <button className="cart-button" onClick={() => setCart((prevCart) => prevCart.delete(key))}>Remove</button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Cart;