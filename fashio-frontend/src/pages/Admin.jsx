import { useState } from 'react';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';

export default function Admin() {
    const [tab, setTab] = useState('products');

    return (
        <section className="section">
            <div className="container">
                <h2>Admin panel</h2>

                <div className="tabs">
                    <button className={'tab' + (tab === 'products' ? ' active' : '')}
                        onClick={() => setTab('products')}>Products</button>
                    <button className={'tab' + (tab === 'orders' ? ' active' : '')}
                        onClick={() => setTab('orders')}>Orders</button>
                </div>

                {tab === 'products' ? <AdminProducts /> : <AdminOrders />}
            </div>
        </section>
    );
}