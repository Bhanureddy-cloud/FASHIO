import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistButton({ productId, className = '', withLabel = false }) {
    const { user } = useAuth();
    const { has, toggle } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();

    const active = has(productId);

    const handleClick = () => {
        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        toggle(productId);
    };

    return (
        <button
            type="button"
            className={`heart ${active ? 'active' : ''} ${className}`}
            onClick={handleClick}
            aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {active ? '♥' : '♡'}
            {withLabel && <span> {active ? 'In wishlist' : 'Add to wishlist'}</span>}
        </button>
    );
}