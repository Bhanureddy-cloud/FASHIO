import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const redirectTo = location.state?.from || '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(redirectTo);
        } catch (err) {
            console.error('LOGIN ERROR:', err);
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('Something went wrong: ' + (err.message || 'unknown error'));
            } 
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <form className="auth-box" onSubmit={handleSubmit}>
                    <h2>Login</h2>

                    <label>Email</label>
                    <input type="email" value={email} required
                        onChange={(e) => setEmail(e.target.value)} />

                    <label>Password</label>
                    <input type="password" value={password} required
                        onChange={(e) => setPassword(e.target.value)} />

                    {error && <p className="error">{error}</p>}

                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="auth-switch">
                        New to FASHIO? <Link to="/register">Create an account</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}