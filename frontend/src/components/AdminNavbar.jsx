import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminNavbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/add') ? 'active' : ''}`} 
                to="/add"
              >
                Add Product
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`} 
                to="/admin"
              >
                Manage Products
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link to="/" className="btn btn-outline-light me-2">
              View Store
            </Link>
            <button 
              className="btn btn-outline-danger"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
