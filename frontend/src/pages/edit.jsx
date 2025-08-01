import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage, FiDollarSign, FiTag, FiFileText } from 'react-icons/fi';
import { getProduct, updateProduct } from '../api/products';

function EditProductPage() {
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: '',
    brand: '',
    category: '',
    image_url: '',
    description: '',
    sizes: [],
    colors: []
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  const [imagePreview, setImagePreview] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const categories = ['sneakers', 'boots', 'sandals', 'slippers', 'loafers'];
  const brands = ['nike', 'adidas', 'puma', 'reebok', 'new balance', 'other'];
  const availableSizes = ['7', '8', '9', '10', '11', '12'];
  const availableColors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setStatus(s => ({ ...s, loading: true }));
      try {
        const response = await fetch(`http://localhost:3000/api/v1/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        
        setForm({
          id: data.id,
          name: data.name || '',
          price: data.price || '',
          brand: data.brand || '',
          category: data.category || '',
          image: data.image || '',
          description: data.description || '',
          sizes: data.sizes || [],
          colors: data.colors || []
        });
        
        if (data.image) {
          setImagePreview(data.image);
        }
        
        setStatus(s => ({ ...s, loading: false }));
      } catch (err) {
        console.error('Error loading product:', err);
        setStatus({ loading: false, success: false, error: 'Error loading product. Please try again.' });
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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product: {
            name: form.name,
            price: parseFloat(form.price),
            brand: form.brand,
            category: form.category,
            description: form.description,
            image: form.image,
            sizes: form.sizes,
            colors: form.colors
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }
      
      setStatus({ loading: false, success: true, error: '' });
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      console.error('Error updating product:', err);
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.message || 'Error updating product. Please try again.' 
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color) => {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  if (status.loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="container py-5">
        <div className="alert alert-light border" role="alert">
          Error: {status.error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline-secondary btn-sm mb-3"
        >
          <FiArrowLeft className="me-1" /> Back
        </button>
        <h2>Edit Product</h2>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-body">
          {status.success && (
            <div className="alert alert-success" role="alert">
              Product updated successfully! Redirecting...
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-5 mb-4">
                <div className="border rounded p-3 text-center" style={{ minHeight: '300px' }}>
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="img-fluid mb-3"
                      style={{ maxHeight: '250px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                      }}
                    />
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '250px' }}>
                      <FiImage size={48} className="text-muted mb-3" />
                      <p className="text-muted">No image selected</p>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <input
                      type="file"
                      id="image-upload"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload" className="btn btn-outline-primary w-100">
                      <FiImage className="me-2" /> Choose Image
                    </label>
                    <small className="text-muted d-block mt-2">Or enter image URL below</small>
                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder="Image URL"
                      value={form.image_url}
                      onChange={(e) => {
                        setForm({...form, image_url: e.target.value});
                        setImagePreview(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-md-7">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    <FiTag className="me-2" /> Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label">
                      <FiDollarSign className="me-2" /> Price
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({...form, price: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="brand" className="form-label">Brand</label>
                    <select
                      className="form-select"
                      id="brand"
                      value={form.brand}
                      onChange={(e) => setForm({...form, brand: e.target.value})}
                      required
                    >
                      <option value="">Select a brand</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>
                          {brand.charAt(0).toUpperCase() + brand.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Available Sizes</label>
                  <div className="d-flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <div key={size} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`size-${size}`}
                          checked={form.sizes.includes(size)}
                          onChange={() => toggleSize(size)}
                        />
                        <label className="form-check-label" htmlFor={`size-${size}`}>
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Available Colors</label>
                  <div className="d-flex flex-wrap gap-3">
                    {availableColors.map(color => (
                      <div key={color.value} className="d-flex align-items-center">
                        <div 
                          className="color-option me-1"
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: color.value,
                            border: form.colors.includes(color.value) 
                              ? '2px solid #0d6efd' 
                              : '1px solid #dee2e6',
                            cursor: 'pointer',
                            boxShadow: form.colors.includes(color.value) 
                              ? '0 0 0 2px #fff, 0 0 0 4px #0d6efd'
                              : 'none'
                          }}
                          onClick={() => toggleColor(color.value)}
                          title={color.name}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    <FiFileText className="me-2" /> Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="4"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={status.loading}
                  >
                    {status.loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="me-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProductPage;
