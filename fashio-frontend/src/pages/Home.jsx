import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/products')
            .then((res) => {
                // newest first: higher id = added later
                const newest = [...res.data].sort((a, b) => b.id - a.id).slice(0, 4);
                setProducts(newest);
            })
            .catch((err) => console.error(err));

        api.get('/categories')
            .then((res) => setCategories([...res.data].sort((a, b) => a.id - b.id)))
            .catch((err) => console.error(err));
    }, []);

    return (
        <>
            <section className="hero">
                <div className="container">
                    <h1>The Style Behind Fashion</h1>
                    <p>New season essentials, made to be worn your way.</p>
                    <Link to="/shop" className="btn">Shop Now</Link>
                </div>
            </section>

            <section className="trust">
                <div className="container trust-grid">
                    <div><strong>Free shipping</strong><span>On every order</span></div>
                    <div><strong>Cash on Delivery</strong><span>Pay when it arrives</span></div>
                    <div><strong>Easy cancellation</strong><span>Cancel before it ships</span></div>
                </div>
            </section>

            {categories.length > 0 && (
                <section className="section">
                    <div className="container">
                        <h2>Shop by category</h2>
                        <div className="cat-grid">
                            {categories.map((c) => (
                                <Link
                                    key={c.id}
                                    to={`/shop?categoryId=${c.id}`}
                                    className="cat-tile"
                                    style={{
                                        backgroundImage:
                                            `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), ` +
                                            `url(https://picsum.photos/seed/cat-${encodeURIComponent(c.name.toLowerCase())}/800/600)`,
                                    }}
                                >
                                    <span>{c.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <h2>New Arrivals</h2>
                        <Link to="/shop" className="see-all">View all</Link>
                    </div>
                    <div className="grid">
                        {products.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            </section>
        </>
    );
}