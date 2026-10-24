import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';
import { money } from '../utils/format';

export default function ProductCard({ product }) {
    return (
        <div className="card">
            <WishlistButton productId={product.id} className="card-heart" />
            <Link to={`/product/${product.id}`}>
                <div className="img-wrap">
                    <img src={product.imageUrl} alt={product.name} loading="lazy" />
                </div>
                <p className="cat">{product.category?.name}</p>
                <p className="name">{product.name}</p>
                <p className="price">{money(product.price)}</p>
            </Link>
        </div>
    );
}