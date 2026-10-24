import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const redirectTo = location.state?.from || '/';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate(redirectTo);
        } catch (err) {
            const status = err.response?.status;
            if (status === 409) {
                setError('This email is already registered');
            } else if (status === 400) {
                setError('Please check your details. Password needs at least 6 characters.');
            } else {
                setError('Something went wrong. Is the backend running?');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <form className="auth-box" onSubmit={handleSubmit}>
                    <h2>Create account</h2>

                    <label>Name</label>
                    <input type="text" value={name} required
                        onChange={(e) => setName(e.target.value)} />

                    <label>Email</label>
                    <input type="email" value={email} required
                        onChange={(e) => setEmail(e.target.value)} />

                    <label>Password</label>
                    <input type="password" value={password} required minLength={6}
                        onChange={(e) => setPassword(e.target.value)} />

                    {error && <p className="error">{error}</p>}

                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Register'}
                    </button>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}