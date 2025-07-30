import React, { useState } from 'react';
import { addProduct } from '../api/products';

function AddProductPage() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    brand: '',
    description: '',
    category: '',
    image: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await addProduct(form);
      setStatus({ loading: false, success: true, error: '' });
      setForm({ name: '', price: '', brand: '', description: '', category: '', image: '' });
      setTimeout(() => setStatus({ loading: false, success: false, error: '' }), 3000);
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div className="form-container">
        <h2 className="mb-4">Add Product</h2>
        {status.success && <div className="alert alert-success">Product added successfully!</div>}
        {status.error && <div className="alert alert-danger">{status.error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Brand</label>
            <input type="text" className="form-control" name="brand" value={form.brand} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input type="text" className="form-control" name="category" value={form.category} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows="3" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input type="text" className="form-control" name="image" value={form.image} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={status.loading}>{status.loading ? 'Adding...' : 'Add Product'}</button>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;