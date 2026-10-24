import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart);

    // save the cart every time it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product, size, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.productId === product.id && i.size === size);
            if (existing) {
                return prev.map((i) =>
                    i === existing
                        ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                        : i
                );
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    price: Number(product.price),
                    size,
                    quantity: Math.min(quantity, product.stock),
                    stock: product.stock,
                },
            ];
        });
    };

    const updateQuantity = (productId, size, quantity) => {
        setItems((prev) =>
            prev.map((i) =>
                i.productId === productId && i.size === size
                    ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
                    : i
            )
        );
    };

    const removeItem = (productId, size) => {
        setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
    };

    const clearCart = () => setItems([]);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);