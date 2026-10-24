import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { money } from '../utils/format';

export default function Checkout() {
    const { items, subtotal, clearCart } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: user?.name || '',
        phone: '',
        line: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const orderPlaced = useRef(false);

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // nothing to check out
    if (items.length === 0 && !orderPlaced.current) return <Navigate to="/cart" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const address =
            `${form.fullName}, ${form.phone}, ${form.line}, ${form.city}, ${form.state} - ${form.pincode}`;

        try {
            const res = await api.post('/orders', {
                address,
                items: items.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    size: i.size || null,
                })),
            });
            orderPlaced.current = true;
            navigate('/orders', { state: { placedId: res.data.id } });
            clearCart();
        } catch (err) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                // token expired or invalid
                logout();
                navigate('/login', { state: { from: '/checkout' } });
            } else if (status === 400) {
                setError(err.response?.data?.message || 'Could not place the order. Please check your cart.');
            } else {
                setError('Something went wrong. Is the backend running?');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <h2>Checkout</h2>

                <div className="cart-layout">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <h3>Delivery address</h3>

                        <div className="form-grid">
                            <div className="field full">
                                <label>Full name</label>
                                <input name="fullName" value={form.fullName} onChange={change} required />
                            </div>

                            <div className="field">
                                <label>Phone</label>
                                <input name="phone" value={form.phone} onChange={change}
                                    required pattern="[0-9]{10}" title="10 digit mobile number" />
                            </div>

                            <div className="field">
                                <label>Pincode</label>
                                <input name="pincode" value={form.pincode} onChange={change}
                                    required pattern="[0-9]{6}" title="6 digit pincode" />
                            </div>

                            <div className="field full">
                                <label>Address (house no, street, area)</label>
                                <input name="line" value={form.line} onChange={change} required />
                            </div>

                            <div className="field">
                                <label>City</label>
                                <input name="city" value={form.city} onChange={change} required />
                            </div>

                            <div className="field">
                                <label>State</label>
                                <input name="state" value={form.state} onChange={change} required />
                            </div>
                        </div>

                        <h3 className="pay-title">Payment</h3>
                        <p className="pay-box">Cash on Delivery</p>

                        {error && <p className="error">{error}</p>}

                        <button className="btn" type="submit" disabled={loading}>
                            {loading ? 'Placing order...' : `Place order · ${money(subtotal)}`}
                        </button>
                    </form>

                    <aside className="summary">
                        <h3>Your items</h3>
                        {items.map((i) => (
                            <div className="summary-row" key={i.productId + '-' + i.size}>
                                <span>
                                    {i.name}{i.size ? ` (${i.size})` : ''} × {i.quantity}
                                </span>
                                <span>{money(i.price * i.quantity)}</span>
                            </div>
                        ))}
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{money(subtotal)}</span>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}