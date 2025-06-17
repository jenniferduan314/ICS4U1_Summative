import { createContext, useState, useContext, useEffect } from "react";
import { Map } from 'immutable';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [genreList, setGenreList] = useState([]);
    const [cart, setCart] = useState(Map());
    const [purchased, setPurchased] = useState(Map());
    const [loading, setLoading] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
                const sessionCart = localStorage.getItem(user.uid);
                if (sessionCart) {
                    setCart(Map(JSON.parse(sessionCart)));
                } else {
                    setCart(Map());
                }
                const getInfo = async () => {
                    try {
                        const docRef = doc(firestore, "users", user.email);
                        const snap = await getDoc(docRef);
                        if (snap.exists()) {
                            const data = (await getDoc(docRef)).data();
                            setPurchased(Map(data.purchased));
                            setGenreList(data.genres);
                        } else {
                            setPurchased(Map());
                        }
                    } catch (error) {
                        console.log(error);
                        alert("Error has occured.");
                    }
                };
                getInfo();
            }
            setLoading(false);
        });
    }, [])

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <StoreContext.Provider value={{ user, setUser, genreList, setGenreList, cart, setCart, purchased, setPurchased, firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}