import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="section">
            <div className="container">
                <h2>Page not found</h2>
                <p className="message">The page you are looking for doesn't exist.</p>
                <Link to="/" className="btn">Back to home</Link>
            </div>
        </section>
    );
}