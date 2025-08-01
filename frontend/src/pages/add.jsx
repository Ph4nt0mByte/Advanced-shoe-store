import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../api/products';
import AdminNavbar from '../components/AdminNavbar';

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

  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <AdminNavbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h2 className="h4 mb-0">Add New Product</h2>
              </div>
              <div className="card-body p-4">
                {status.success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    Product added successfully!
                    <button type="button" className="btn-close" onClick={() => setStatus({...status, success: false})}></button>
                  </div>
                )}
                {status.error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {status.error}
                    <button type="button" className="btn-close" onClick={() => setStatus({...status, error: ''})}></button>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Product Name</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      placeholder="Enter product name"
                      required 
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold">Price ($)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="price" 
                        value={form.price} 
                        onChange={handleChange} 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        required 
                      />
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-bold">Brand</label>
                      <select 
                        className="form-select" 
                        name="brand" 
                        value={form.brand} 
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select brand</option>
                        <option value="nike">Nike</option>
                        <option value="adidas">Adidas</option>
                        <option value="jordan">Jordan</option>
                        <option value="puma">Puma</option>
                        <option value="new-balance">New Balance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">Category</label>
                    <select 
                      className="form-select" 
                      name="category" 
                      value={form.category} 
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="running">Running</option>
                      <option value="basketball">Basketball</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="training">Training</option>
                      <option value="soccer">Soccer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">Description</label>
                    <textarea 
                      className="form-control" 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      rows="4" 
                      placeholder="Enter product description"
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">Image URL</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      name="image" 
                      value={form.image} 
                      onChange={handleChange} 
                      placeholder="https://example.com/image.jpg"
                    />
                    {form.image && (
                      <div className="mt-2">
                        <small className="text-muted">Preview:</small>
                        <img 
                          src={form.image} 
                          alt="Preview" 
                          className="img-thumbnail mt-2" 
                          style={{ maxHeight: '100px' }}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg px-4" 
                      disabled={status.loading}
                    >
                      {status.loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Adding...
                        </>
                      ) : (
                        'Add Product'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;