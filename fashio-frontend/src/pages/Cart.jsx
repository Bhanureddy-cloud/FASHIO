import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { money } from '../utils/format';

export default function Cart() {
    const { items, updateQuantity, removeItem, subtotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login', { state: { from: '/checkout' } });
        } else {
            navigate('/checkout');
        }
    };

    if (items.length === 0) {
        return (
            <section className="section">
                <div className="container">
                    <h2>Your cart</h2>
                    <p className="message">Your cart is empty.</p>
                    <Link to="/shop" className="btn">Continue shopping</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="container">
                <h2>Your cart</h2>

                <div className="cart-layout">
                    <div className="cart-list">
                        {items.map((i) => (
                            <div className="cart-row" key={i.productId + '-' + i.size}>
                                <img src={i.imageUrl} alt={i.name} />

                                <div className="cart-info">
                                    <Link to={`/product/${i.productId}`} className="cart-name">{i.name}</Link>
                                    {i.size && <p className="muted">Size: {i.size}</p>}
                                    <p className="muted">{money(i.price)}</p>
                                    <button className="link-btn remove" onClick={() => removeItem(i.productId, i.size)}>
                                        Remove
                                    </button>
                                </div>

                                <div className="qty">
                                    <button onClick={() => updateQuantity(i.productId, i.size, i.quantity - 1)}>−</button>
                                    <span>{i.quantity}</span>
                                    <button onClick={() => updateQuantity(i.productId, i.size, i.quantity + 1)}>+</button>
                                </div>

                                <p className="cart-total">{money(i.price * i.quantity)}</p>
                            </div>
                        ))}
                    </div>

                    <aside className="summary">
                        <h3>Order summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{money(subtotal)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{money(subtotal)}</span>
                        </div>
                        <button className="btn" onClick={handleCheckout}>Proceed to checkout</button>
                        {!user && <p className="muted small">You'll be asked to log in first.</p>}
                    </aside>
                </div>
            </div>
        </section>
    );
}