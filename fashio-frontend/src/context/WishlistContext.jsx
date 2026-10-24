import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const email = user?.email;
    const [list, setList] = useState([]);

    // load the wishlist whenever someone logs in
    useEffect(() => {
        if (!email) return;
        let cancelled = false;
        api.get('/wishlist')
            .then((res) => { if (!cancelled) setList(res.data); })
            .catch(() => { });
        return () => {
            cancelled = true;
            setList([]);
        };
    }, [email]);

    const items = email ? list : [];

    const has = (productId) => items.some((p) => p.id === productId);

    const toggle = async (productId) => {
        try {
            const res = has(productId)
                ? await api.delete(`/wishlist/${productId}`)
                : await api.post(`/wishlist/${productId}`);
            setList(res.data);
        } catch (err) {
            console.error('WISHLIST ERROR:', err.response?.status, err.response?.data || err.message);
            alert('Wishlist failed: ' + (err.response?.status || err.message));
        }
    };

    return (
        <WishlistContext.Provider value={{ items, has, toggle }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);