import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct } from '../api/products';

function EditProductPage() {
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: '',
    image: '',
    description: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setStatus(s => ({ ...s, loading: true }));
      try {
        const data = await getProduct(id);
        setForm({ id: data.id, name: data.name || '', price: data.price || '', image: data.image || '', description: data.description || '' });
        setStatus(s => ({ ...s, loading: false }));
      } catch (err) {
        setStatus({ loading: false, success: false, error: 'Error loading product' });
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await updateProduct(id, form);
      setStatus({ loading: false, success: true, error: '' });
      setTimeout(() => setStatus({ loading: false, success: false, error: '' }), 3000);
      navigate('/admin');
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="container mt-5">
      <h1>Edit Product</h1>
      {status.success && <div className="alert alert-success mt-3">Product updated successfully!</div>}
      {status.error && <div className="alert alert-danger mt-3">{status.error}</div>}
      <form className="mt-4" onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={form.id} />
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input type="text" className="form-control" name="image" value={form.image} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows="2" />
        </div>
        <button type="submit" className="btn btn-success" disabled={status.loading}>{status.loading ? 'Saving...' : 'Save Changes'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => window.history.back()}>Cancel</button>
      </form>
    </div>
  );
}

export default EditProductPage;
