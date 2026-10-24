import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { money } from '../../utils/format';

const emptyForm = {
    name: '', description: '', price: '', stock: '',
    imageUrl: '', sizes: '', colors: '', categoryId: '',
};

function errorText(err) {
    const status = err.response?.status;
    if (status === 401 || status === 403) return 'Not authorised. Please log in again as admin.';
    return err.response?.data?.message || 'Something went wrong. Is the backend running?';
}

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [reload, setReload] = useState(0);

    useEffect(() => {
        api.get('/products')
            .then((res) => setProducts(res.data))
            .catch(() => setError('Could not load products.'));
    }, [reload]);

    useEffect(() => {
        api.get('/categories').then((res) => setCategories(res.data)).catch(() => { });
    }, []);

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const startAdd = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
        setError('');
        setMessage('');
    };

    const startEdit = (p) => {
        setForm({
            name: p.name,
            description: p.description || '',
            price: p.price,
            stock: p.stock ?? 0,
            imageUrl: p.imageUrl || '',
            sizes: p.sizes || '',
            colors: p.colors || '',
            categoryId: p.category?.id || '',
        });
        setEditingId(p.id);
        setShowForm(true);
        setError('');
        setMessage('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setSaving(true);

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            stock: Number(form.stock),
            imageUrl: form.imageUrl.trim(),
            sizes: form.sizes.trim(),
            colors: form.colors.trim(),
            category: form.categoryId ? { id: Number(form.categoryId) } : null,
        };

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, payload);
                setMessage('Product updated.');
            } else {
                await api.post('/products', payload);
                setMessage('Product added.');
            }
            cancel();
            setReload((r) => r + 1);
        } catch (err) {
            setError(errorText(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (p) => {
        if (!window.confirm(`Delete "${p.name}"?`)) return;
        setError('');
        setMessage('');
        try {
            await api.delete(`/products/${p.id}`);
            setMessage('Product deleted.');
            setReload((r) => r + 1);
        } catch (err) {
            setError(errorText(err));
        }
    };

    return (
        <div>
            <div className="admin-bar">
                <h3>Products ({products.length})</h3>
                {!showForm && <button className="btn small-btn" onClick={startAdd}>+ Add product</button>}
            </div>

            {message && <p className="banner">{message}</p>}
            {error && <p className="error">{error}</p>}

            {showForm && (
                <form className="checkout-form admin-form" onSubmit={handleSubmit}>
                    <h3>{editingId ? 'Edit product' : 'New product'}</h3>

                    <div className="form-grid">
                        <div className="field full">
                            <label>Name</label>
                            <input name="name" value={form.name} onChange={change} required />
                        </div>

                        <div className="field full">
                            <label>Description</label>
                            <textarea name="description" value={form.description} onChange={change} rows={3} />
                        </div>

                        <div className="field">
                            <label>Price (₹)</label>
                            <input name="price" type="number" min="0" step="0.01"
                                value={form.price} onChange={change} required />
                        </div>

                        <div className="field">
                            <label>Stock</label>
                            <input name="stock" type="number" min="0"
                                value={form.stock} onChange={change} required />
                        </div>

                        <div className="field full">
                            <label>Image URL</label>
                            <input name="imageUrl" value={form.imageUrl} onChange={change} />
                        </div>

                        <div className="field">
                            <label>Sizes (comma separated)</label>
                            <input name="sizes" value={form.sizes} onChange={change} placeholder="S,M,L,XL" />
                        </div>

                        <div className="field">
                            <label>Colours (comma separated)</label>
                            <input name="colors" value={form.colors} onChange={change} placeholder="Black,White" />
                        </div>

                        <div className="field full">
                            <label>Category</label>
                            <select name="categoryId" value={form.categoryId} onChange={change} required>
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="admin-actions">
                        <button className="btn" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
                        </button>
                        <button className="btn ghost" type="button" onClick={cancel}>Cancel</button>
                    </div>
                </form>
            )}

            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td><img className="thumb" src={p.imageUrl} alt="" /></td>
                                <td>{p.name}</td>
                                <td>{p.category?.name}</td>
                                <td>{money(p.price)}</td>
                                <td>{p.stock}</td>
                                <td className="row-actions">
                                    <button className="link-btn" onClick={() => startEdit(p)}>Edit</button>
                                    <button className="link-btn remove" onClick={() => handleDelete(p)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}