import { createContext, useState, useContext } from "react";
import { Map } from 'immutable';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [genreList, setGenreList] = useState([]);
    const [cart, setCart] = useState(Map());

    return (
        <StoreContext.Provider value={{ firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, loggedIn, setLoggedIn, genreList, setGenreList, cart, setCart }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}