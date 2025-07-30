import React, { useState, useEffect } from 'react';
import { listProducts, deleteProduct } from '../api/products';

function ManageProductsPage() {
  const [products, setProducts] = useState([]);

  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const data = await listProducts();
      setProducts(data);
    } catch (err) {
      setSuccess('Error loading products');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSuccess('Product deleted successfully!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setSuccess(err.message);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Products</h1>
        <div>
          <a href="/add" className="btn btn-primary me-2">
            <i className="bi bi-plus-lg"></i> Add New Product
          </a>
          <a href="/" className="btn btn-secondary">
            <i className="bi bi-shop"></i> Back to Store
          </a>
        </div>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="row">
        {products.length === 0 ? (
          <div className="col-12 text-center">No products available.</div>
        ) : (
          products.map((product) => (
            <div className="col-md-4" key={product.id}>
              <div className="card product-card position-relative">
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">${product.price.toFixed(2)}</span>
                    <button className="btn btn-danger btn-delete" title="Delete" onClick={() => handleDelete(product.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageProductsPage;