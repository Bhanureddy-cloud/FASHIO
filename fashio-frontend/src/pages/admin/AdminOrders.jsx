import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { money } from '../../utils/format';

const STATUSES = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/admin/orders')
            .then((res) => setOrders(res.data))
            .catch(() => setError('Could not load orders.'))
            .finally(() => setLoading(false));
    }, []);

    const changeStatus = async (id, status) => {
        setError('');
        try {
            const res = await api.put(`/admin/orders/${id}/status`, { status });
            setOrders((prev) => prev.map((o) => (o.id === id ? res.data : o)));
        } catch (err) {
            setError(err.response?.data?.message || 'Could not update the order status.');
        }
    };

    return (
        <div>
            <div className="admin-bar">
                <h3>All orders ({orders.length})</h3>
            </div>

            {error && <p className="error">{error}</p>}
            {loading && <p className="message">Loading...</p>}
            {!loading && orders.length === 0 && <p className="message">No orders yet.</p>}

            {orders.map((o) => (
                <div className="order-card" key={o.id}>
                    <div className="order-head">
                        <div>
                            <strong>Order #{o.id}</strong>
                            <p className="muted">{formatDate(o.createdAt)}</p>
                            <p className="muted">{o.customerName} · {o.customerEmail}</p>
                        </div>

                        <select
                            className={'status-select status-' + o.status.toLowerCase()}
                            value={o.status}
                            disabled={o.status === 'CANCELLED'}
                            onChange={(e) => changeStatus(o.id, e.target.value)}
                        >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {o.items.map((it, idx) => (
                        <div className="order-item" key={idx}>
                            <img src={it.imageUrl} alt={it.productName} />
                            <div>
                                <span className="cart-name">{it.productName}</span>
                                <p className="muted">
                                    {it.size ? `Size: ${it.size} · ` : ''}Qty: {it.quantity}
                                </p>
                            </div>
                            <span>{money(it.price * it.quantity)}</span>
                        </div>
                    ))}

                    <div className="order-foot">
                        <p className="muted">Deliver to: {o.address}</p>
                        <p className="order-total">Total: {money(o.totalPrice)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}