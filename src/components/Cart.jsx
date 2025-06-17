import "./Cart.css";
import { useNavigate } from "react-router";
import { useStoreContext } from "../context";
import { firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Map } from 'immutable';

function Cart() {
    const navigate = useNavigate();
    const { user, cart, setCart, genreList, purchased, setPurchased } = useStoreContext();

    const buy = async () => {
        if (cart.size <= 0) {
            return alert("Cart is empty.");
        }

        const docRef = doc(firestore, "users", user.email);
        const userData = { purchased: cart.toJS(), };
        await setDoc(docRef, userData, { merge: true });
        localStorage.removeItem(user.uid);
        setCart(Map());
        const getPurchases = async () => {
            const docRef = doc(firestore, "users", user.email);
            const data = (await getDoc(docRef)).data();
            setPurchased(Map(data.purchased));
        }
        getPurchases();
        alert ("Thanks for shopping at Meow Movies!!");
    }

    function removeItem (key) {
        setCart((prevCart) => {
            const newCart = prevCart.delete(key);
            localStorage.removeItem(user.uid);
            localStorage.setItem(user.uid, JSON.stringify(newCart.toJS()));
            return newCart;
        });
    }

    return (
        <div className="cart">
            <button className="cart-back" onClick={() => navigate(-1)}>Back</button>
            <label className="cart-title">Cart</label>
            <div className="cart-items">
                {
                    cart.entrySeq().map(([key, movie]) => {
                        return (
                            <div className="cart-item" key={key}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster}`} width={"250px"} />
                                <label className="cart-movie">{movie.title}</label>
                                <button className="cart-button" onClick={() => removeItem(key)}>Remove</button>
                            </div>
                        )
                    })
                }
            </div>
            <div className="pay">
                <button className="cart-button" onClick={() => buy()}>Purchase</button>
            </div>
        </div>
    )
}

export default Cart;