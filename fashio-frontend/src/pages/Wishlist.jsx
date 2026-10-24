import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
    const { items } = useWishlist();

    return (
        <section className="section">
            <div className="container">
                <h2>My wishlist</h2>

                {items.length === 0 ? (
                    <>
                        <p className="message">Your wishlist is empty. Tap the heart on any product to save it.</p>
                        <Link to="/shop" className="btn">Browse products</Link>
                    </>
                ) : (
                    <div className="grid">
                        {items.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>
        </section>
    );
}