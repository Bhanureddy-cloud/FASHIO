import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { money } from '../utils/format';
import WishlistButton from '../components/WishlistButton';
import Reviews from '../components/Reviews';

export default function ProductDetail() {
    const { id } = useParams();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [size, setSize] = useState('');
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setAdded(false);
        api.get(`/products/${id}`)
            .then((res) => { setProduct(res.data); setError(''); })
            .catch((err) =>
                setError(err.response?.status === 404 ? 'Product not found.' : 'Could not load this product.')
            )
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="message container">Loading...</p>;
    if (error) return <p className="message container error">{error}</p>;
    if (!product) return null;

    const sizes = (product.sizes || '').split(',').map((s) => s.trim()).filter(Boolean);
    const colors = (product.colors || '').split(',').map((c) => c.trim()).filter(Boolean);
    const outOfStock = !product.stock || product.stock <= 0;

    const handleAdd = () => {
        if (sizes.length > 0 && !size) {
            setSizeError(true);
            return;
        }
        setSizeError(false);
        addItem(product, size, qty);
        setAdded(true);
    };

    return (
        <section className="section">
            <div className="container detail">
                <div className="detail-img">
                    <img src={product.imageUrl} alt={product.name} />
                </div>

                <div className="detail-info">
                    <p className="cat">{product.category?.name}</p>
                    <h1>{product.name}</h1>
                    <WishlistButton productId={product.id} className="detail-heart" withLabel />
                    <p className="detail-price">{money(product.price)}</p>
                    <p className="detail-desc">{product.description}</p>

                    {colors.length > 0 && (
                        <p className="detail-colors"><strong>Colours:</strong> {colors.join(', ')}</p>
                    )}

                    {sizes.length > 0 && (
                        <>
                            <p className="detail-label">Select size</p>
                            <div className="sizes">
                                {sizes.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        className={'size-btn' + (size === s ? ' active' : '')}
                                        onClick={() => { setSize(s); setSizeError(false); setAdded(false); }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {sizeError && <p className="error">Please select a size.</p>}
                        </>
                    )}

                    {outOfStock ? (
                        <p className="error">Out of stock</p>
                    ) : (
                        <>
                            <p className="detail-label">Quantity</p>
                            <div className="qty">
                                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                                <span>{qty}</span>
                                <button type="button" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                            </div>
                            <p className="stock-note">{product.stock} in stock</p>

                            <button className="btn add-btn" onClick={handleAdd}>Add to cart</button>
                        </>
                    )}

                    {added && (
                        <p className="added">
                            Added to cart. <Link to="/cart">View cart</Link>
                        </p>
                    )}
                </div>
            </div>
            <div className="container">
                <Reviews productId={product.id} />
            </div>
        </section>
    );
}