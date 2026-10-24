import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Shop() {
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    const [q, setQ] = useState('');
    const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    
    // load categories once
    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data)).catch(() => { });
    }, []);

    // reload products whenever a filter changes
    useEffect(() => {
        const params = {};
        if (q.trim()) params.q = q.trim();
        if (categoryId) params.categoryId = categoryId;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        setLoading(true);
        api.get('/products', { params })
            .then((res) => { setProducts(res.data); setError(''); })
            .catch(() => setError('Could not load products. Is the backend running?'))
            .finally(() => setLoading(false));
    }, [q, categoryId, minPrice, maxPrice]);

    useEffect(() => {
        setCategoryId(searchParams.get('categoryId') || '');
    }, [searchParams]);


    return (
        <section className="section">
            <div className="container">
                <h2>Shop</h2>

                <div className="filters">
                    <input type="text" placeholder="Search products..." value={q}
                        onChange={(e) => setQ(e.target.value)} />
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">All categories</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="number" placeholder="Min ₹" value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)} />
                    <input type="number" placeholder="Max ₹" value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)} />
                </div>

                {error && <p className="message error">{error}</p>}
                {loading && !error && <p className="message">Loading...</p>}
                {!loading && !error && products.length === 0 && <p className="message">No products found.</p>}

                <div className="grid">
                    {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        </section>
    );
}