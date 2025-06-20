import { createContext, useState, useContext, useEffect } from "react";
import { Map } from "immutable";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [genreList, setGenreList] = useState([]);
    const [cart, setCart] = useState(Map());
    const [purchased, setPurchased] = useState(Map());
    const [loading, setLoading] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                setLoggedIn(true);

                // Extract first/last name from displayName if available
                if (user.displayName) {
                    const nameParts = user.displayName.split(" ");
                    setFirstName(nameParts[0] || "");
                    setLastName(nameParts.slice(1).join(" ") || "");
                } else {
                    setFirstName("");
                    setLastName("");
                }

                const sessionCart = localStorage.getItem(user.uid);
                if (sessionCart) {
                    setCart(Map(JSON.parse(sessionCart)));
                } else {
                    setCart(Map());
                }

                try {
                    const docRef = doc(firestore, "users", user.email);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        setPurchased(Map(data.purchased));
                        setGenreList(data.genres);
                    } else {
                        setPurchased(Map());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    alert("An error has occurred.");
                }
            } else {
                setUser(null);
                setLoggedIn(false);
                setFirstName("");
                setLastName("");
            }
            setLoading(false);
        });
    }, []);

    // Optional enhancement: keep firstName and lastName in sync with user.displayName whenever user changes
    useEffect(() => {
        if (user?.displayName) {
            const nameParts = user.displayName.split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
        } else {
            setFirstName("");
            setLastName("");
        }
    }, [user]);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <StoreContext.Provider
            value={{
                user,
                setUser,
                loggedIn,
                setLoggedIn,
                genreList,
                setGenreList,
                cart,
                setCart,
                purchased,
                setPurchased,
                firstName,
                setFirstName,
                lastName,
                setLastName,
                email,
                setEmail,
                password,
                setPassword,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(StoreContext);
};
