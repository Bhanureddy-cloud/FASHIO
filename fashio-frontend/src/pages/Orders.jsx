import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { money } from '../utils/format';

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

export default function Orders() {
    const location = useLocation();
    const placedId = location.state?.placedId;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    useEffect(() => {
        api.get('/orders/my')
            .then((res) => setOrders(res.data))
            .catch(() => setError('Could not load your orders.'))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this order?')) return;
        setActionError('');
        try {
            const res = await api.put(`/orders/${id}/cancel`);
            setOrders((prev) => prev.map((o) => (o.id === id ? res.data : o)));
        } catch (err) {
            setActionError(err.response?.data?.message || 'Could not cancel the order.');
        }
    };

    return (
        <section className="section">
            <div className="container">
                <h2>My orders</h2>

                {placedId && (
                    <p className="banner">
                        Order #{placedId} placed successfully. Thank you for shopping with FASHIO!
                    </p>
                )}

                {actionError && <p className="error">{actionError}</p>}
                {loading && <p className="message">Loading...</p>}
                {error && <p className="message error">{error}</p>}

                {!loading && !error && orders.length === 0 && (
                    <>
                        <p className="message">You haven't placed any orders yet.</p>
                        <Link to="/shop" className="btn">Start shopping</Link>
                    </>
                )}

                {orders.map((o) => (
                    <div className="order-card" key={o.id}>
                        <div className="order-head">
                            <div>
                                <strong>Order #{o.id}</strong>
                                <p className="muted">{formatDate(o.createdAt)}</p>
                            </div>
                            <span className={'status status-' + o.status.toLowerCase()}>{o.status}</span>
                        </div>

                        {o.items.map((it, idx) => (
                            <div className="order-item" key={idx}>
                                <img src={it.imageUrl} alt={it.productName} />
                                <div>
                                    <Link to={`/product/${it.productId}`} className="cart-name">{it.productName}</Link>
                                    <p className="muted">
                                        {it.size ? `Size: ${it.size} · ` : ''}Qty: {it.quantity}
                                    </p>
                                </div>
                                <span>{money(it.price * it.quantity)}</span>
                            </div>
                        ))}

                        <div className="order-foot">
                            <p className="muted">Deliver to: {o.address}</p>
                            <div>
                                <p className="order-total">Total: {money(o.totalPrice)}</p>
                                {o.status === 'PLACED' && (
                                    <button className="link-btn remove" onClick={() => handleCancel(o.id)}>
                                        Cancel order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}