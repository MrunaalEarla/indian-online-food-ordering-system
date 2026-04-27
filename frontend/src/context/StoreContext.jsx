import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [products, setProducts] = useState([]);
    const [language, setLanguage] = useState('en'); // 'en' or 'te'
    const [settings, setSettings] = useState(null);

    const url = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${url}/api/products`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${url}/api/public/settings`);
            setSettings(response.data);
        } catch (error) {
            console.error("❌ Settings Fetch Error:", error.message);
            if (error.response) {
                console.error("Response Data:", error.response.data);
                console.error("Response Status:", error.response.status);
            }
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchSettings();
    }, [token]);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev };
            if (updated[itemId] > 1) {
                updated[itemId] -= 1;
            } else {
                delete updated[itemId];
            }
            return updated;
        });
    };

    const getTotalAmount = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = products.find((product) => product._id === item);
                if (itemInfo) {
                    total += itemInfo.price * cartItems[item];
                }
            }
        }
        return total;
    };

    const contextValue = {
        url,
        token,
        setToken,
        user,
        setUser,
        products,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalAmount,
        language,
        setLanguage
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
