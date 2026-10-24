import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Stars from './Stars';

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

export default function Reviews({ productId }) {
    const { user } = useAuth();
    const location = useLocation();

    const [data, setData] = useState({ average: 0, count: 0, reviews: [] });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        api.get(`/reviews/product/${productId}`)
            .then((res) => {
                setData(res.data);
                // if I already reviewed this product, fill the form with my review
                const mine = res.data.reviews.find((r) => r.mine);
                setRating(mine ? mine.rating : 0);
                setComment(mine ? mine.comment || '' : '');
            })
            .catch(() => setError('Could not load reviews.'));
    }, [productId, reload, user?.email]);

    const myReview = data.reviews.find((r) => r.mine);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (rating === 0) {
            setError('Please choose a star rating.');
            return;
        }
        setSaving(true);
        try {
            await api.post(`/reviews/product/${productId}`, { rating, comment });
            setReload((r) => r + 1);
        } catch (err) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                setError('Please log in again to post a review.');
            } else if (status === 400) {
                setError('Rating must be 1 to 5 and the comment under 1000 characters.');
            } else {
                setError('Something went wrong. Is the backend running?');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        setError('');
        try {
            await api.delete(`/reviews/${id}`);
            setReload((r) => r + 1);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not delete the review.');
        }
    };

    return (
        <div className="reviews">
            <h2>Reviews</h2>

            <div className="review-summary">
                {data.count > 0 ? (
                    <>
                        <span className="avg">{data.average.toFixed(1)}</span>
                        <Stars value={data.average} size={22} />
                        <span className="muted">{data.count} review{data.count > 1 ? 's' : ''}</span>
                    </>
                ) : (
                    <span className="muted">No reviews yet. Be the first to review this product.</span>
                )}
            </div>

            {user ? (
                <form className="review-form" onSubmit={handleSubmit}>
                    <h3>{myReview ? 'Edit your review' : 'Write a review'}</h3>

                    <div className="star-input">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                type="button"
                                key={n}
                                className={'star-btn' + (n <= rating ? ' on' : '')}
                                onClick={() => setRating(n)}
                                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        rows={3}
                        maxLength={1000}
                        placeholder="Share your thoughts about this product (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {error && <p className="error">{error}</p>}

                    <button className="btn" type="submit" disabled={saving}>
                        {saving ? 'Saving...' : myReview ? 'Update review' : 'Submit review'}
                    </button>
                </form>
            ) : (
                <p className="review-login">
                    <Link to="/login" state={{ from: location.pathname }}>Log in</Link> to write a review.
                </p>
            )}

            {!user && error && <p className="error">{error}</p>}

            <div className="review-list">
                {data.reviews.map((r) => (
                    <div className="review" key={r.id}>
                        <div className="review-top">
                            <strong>{r.userName}{r.mine && ' (you)'}</strong>
                            <Stars value={r.rating} size={16} />
                            <span className="muted">{formatDate(r.createdAt)}</span>
                        </div>
                        {r.comment && <p className="review-text">{r.comment}</p>}
                        {(r.mine || user?.role === 'ADMIN') && (
                            <button className="link-btn remove" onClick={() => handleDelete(r.id)}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}