import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiShoppingBag, FiArrowLeft, FiLogOut } from 'react-icons/fi';

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  // Redirect to home if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Admin - Raw API response:', data);
        
        const processedProducts = data.map((product) => {
          // Try to find the image URL in common field names
          const imageUrl = product.image || 
                          product.image_url || 
                          product.images?.[0] || 
                          'https://via.placeholder.com/300';
          
          return {
            ...product,
            imageUrl: imageUrl,  // Add the resolved image URL
            price: parseFloat(product.price) || 0,
            brand: product.brand || 'other',
            category: product.category || 'uncategorized'
          };
        });
        
        console.log('Admin - Processed products:', processedProducts);
        setProducts(processedProducts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? It will be moved to the deleted items.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/v1/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors ? errorData.errors[0] : 'Failed to delete product');
        }

        // Remove the product from the list since it's now soft deleted
        setProducts(products.filter(product => product.id !== id));
        
        // Show success message
        alert('Product has been moved to deleted items.');
      } catch (err) {
        setError(err.message);
        console.error('Error deleting product:', err);
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-light border" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (products.length === 0) {
      return (
        <div className="text-center p-5">
          <FiShoppingBag size={48} className="mb-3" />
          <h4>No products found</h4>
          <p className="text-muted">Add your first product to get started</p>
          <Link to="/add" className="btn btn-primary mt-3">
            <FiPlus className="me-2" /> Add Product
          </Link>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-image">
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      onError={(e) => {
                        console.error('Error loading image:', product.imageUrl);
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = `https://via.placeholder.com/50?text=${encodeURIComponent(product.name.substring(0, 2))}`;
                      }}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{product.brand || 'N/A'}</td>
                <td>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/edit/${product.id}`} 
                      className="btn btn-sm btn-outline-primary"
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-sm btn-outline-secondary"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <div className="d-flex align-items-center gap-2">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-secondary btn-sm"
            title="Logout"
          >
            <FiLogOut className="me-1" /> Logout
          </button>
          <Link to="/products" className="btn btn-outline-secondary btn-sm me-2">
            <FiArrowLeft className="me-1" /> Store
          </Link>
          <Link to="/add" className="btn btn-outline-dark btn-sm">
            <FiPlus className="me-1" /> Add Product
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-3 border rounded">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage;
