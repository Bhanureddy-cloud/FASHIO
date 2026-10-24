import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="navbar">
            <div className="container">
                <Link to="/" className="logo">FASHIO</Link>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/cart">
                        Cart{itemCount > 0 && <span className="badge">{itemCount}</span>}
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
                            <Link to="/orders">Orders</Link>
                            <Link to="/wishlist">Wishlist</Link>
                            <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
                            <button className="link-btn" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}