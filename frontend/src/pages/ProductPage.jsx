import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { addToCart, getCartItemCount } from '../utils/cart';
import '../styles/ProductPage.css';
import '../pages/HomePage';

function ProductPage() {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Filter states
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  // Modal image state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
    updateCartCount();
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [brandFilter, categoryFilter, priceFilter, products]);

  // Load products from backend
  const loadProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('Raw API response:', data); // Debug log
      
      const processedProducts = data.map((product) => {
        // Debug log to see what fields are available
        console.log('Product data:', {
          id: product.id,
          name: product.name,
          image: product.image,
          image_url: product.image_url,
          allFields: Object.keys(product)
        });
        
        // Try to find the image URL in common field names
        const imageUrl = product.image || 
                        product.image_url || 
                        product.images?.[0] || 
                        'https://via.placeholder.com/300';
        
        return {
          id: product.id,
          name: product.name,
          brand: product.brand || 'other',
          price: parseFloat(product.price),
          category: product.category || 'casual',
          images: [imageUrl],
          description: product.description || 'No description available',
          sizes: Array.isArray(product.sizes) ? product.sizes : ["7", "8", "9", "10", "11", "12"],
          colors: Array.isArray(product.colors) ? product.colors : ["#000000", "#FFFFFF", "#FF0000"]
        };
      });
      
      console.log('Processed products:', processedProducts);
      setProducts(processedProducts);
      setFilteredProducts(processedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Show error to user
      alert('Failed to load products. Please try again later.');
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...products];

    if (brandFilter) {
      filtered = filtered.filter(product => product.brand.toLowerCase() === brandFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (priceFilter) {
      if (priceFilter === '0-100') {
        filtered = filtered.filter(product => product.price <= 100);
      } else if (priceFilter === '100-200') {
        filtered = filtered.filter(product => product.price > 100 && product.price <= 200);
      } else if (priceFilter === '200+') {
        filtered = filtered.filter(product => product.price > 200);
      }
    }

    setFilteredProducts(filtered);
  };

  // Open product modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setSelectedColor(null);
    setCurrentImageIndex(0);
    setModalActive(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal
  const closeModal = () => {
    setModalActive(false);
    setSelectedProduct(null);
    setSelectedSize(null);
    setSelectedColor(null);
    document.body.style.overflow = '';
  };

  // Change main image
  const changeMainImage = (imageSrc, index) => {
    setCurrentImageIndex(index);
  };

  // Select size
  const selectSize = (size) => {
    setSelectedSize(size);
  };

  // Select color
  const selectColor = (color) => {
    setSelectedColor(color);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      brand: selectedProduct.brand,
      price: selectedProduct.price,
      size: selectedSize,
      color: selectedColor,
      image: selectedProduct.images[0],
      quantity: 1
    };

    addToCart(item);
    updateCartCount();
    alert('Item added to cart!');
  };

  // Update cart count
  const updateCartCount = () => {
    setCartCount(getCartItemCount());
  };

  // Buy now
  const buyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    // Add the item to cart
    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      brand: selectedProduct.brand,
      price: selectedProduct.price,
      size: selectedSize,
      color: selectedColor,
      image: selectedProduct.images[0],
      quantity: 1
    };

    addToCart(item);
    updateCartCount();
    
    // Navigate to cart page
    window.location.href = '/cart';
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Handle modal overlay click
  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="product-page">
      {/* Navigation */}
      <div className="navigation">
        <div className="navbar">
          <div className="nav-left">
            <a href="#" className="nav-link">PRODUCTS</a>
            <a href="/#featured-section" className="nav-link">FEATURED</a>
            <a href="/#footer-section" className="nav-link">ABOUT US</a>
          </div>

          <div className="nav-center">
            <Link to="/home">
              <img src="/productpage/img/logo.png" alt="SHODES" className="logo" />
            </Link>
          </div>

          <div className="nav-right">
            <a href="/home#contact-section" className="nav-link">CONTACT</a>
            <Link to="/cart" className="cart-icon">
              <img src="/productpage/img/cart.svg" alt="Shopping Cart" className="cart-img" />
              <span className={`cart-count ${cartCount > 0 ? 'show' : ''}`}>{cartCount}</span>
            </Link>
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <img className="menu" src="/productpage/img/Menu.svg" alt="Menu" />
        </div>
        <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <span className="close-btn" onClick={toggleMenu}>
            <i className="fas fa-times"></i>
          </span>
                      <ul>
              <li><Link to="/products">Products</Link></li>
              <li><a href="/#featured-section">Featured</a></li>
              <li><a href="/#footer-section">About Us</a></li>
              <li><a href="/#contact-section">Contact</a></li>
            </ul>
        </div>
      </div>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-container">
          <h1 className="products-title">Products</h1>
          
          <div className="filter-bar">
            <div className="filter-group">
              <label>Brand:</label>
              <select 
                value={brandFilter} 
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="">All Brands</option>
                <option value="nike">Nike</option>
                <option value="adidas">Adidas</option>
                <option value="jordan">Jordan</option>
                <option value="puma">Puma</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="running">Running</option>
                <option value="basketball">Basketball</option>
                <option value="casual">Casual</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Price:</label>
              <select 
                value={priceFilter} 
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="0-100">$0 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200+">$200+</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card" 
                onClick={() => openModal(product)}
              >
                <div className="product-image">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    onError={(e) => {
                      console.error('Error loading image:', product.images[0]);
                      e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      e.target.src = `https://via.placeholder.com/250x200?text=${encodeURIComponent(product.name)}`;
                    }}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-brand">{product.brand}</div>
                  <div className="product-price">${product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {modalActive && selectedProduct && (
        <div className={`modal-overlay ${modalActive ? 'active' : ''}`} onClick={handleModalOverlayClick}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <div className="modal-images">
                <div className="main-image">
                  <img 
                    src={selectedProduct.images[currentImageIndex]} 
                    alt={selectedProduct.name}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300?text=${selectedProduct.name}`;
                    }}
                  />
                </div>
                <div className="thumbnail-images">
                  {selectedProduct.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`} 
                      onClick={() => changeMainImage(image, index)}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/60x60?text=Img`;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-details">
                <h2>{selectedProduct.name}</h2>
                <p className="modal-brand">{selectedProduct.brand}</p>
                <div className="modal-price">${selectedProduct.price}</div>
                <div className="modal-description">{selectedProduct.description}</div>
                
                <div className="size-selection">
                  <h4>Size:</h4>
                  <div className="size-options">
                    {selectedProduct.sizes.map(size => (
                      <button 
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => selectSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="color-selection">
                  <h4>Color:</h4>
                  <div className="color-options">
                    {selectedProduct.colors.map(color => (
                      <div 
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => selectColor(color)}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <button className="buy-now-btn" onClick={buyNow}>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer" id="footer-section">
        <div className="footer-container">
          <div className="footer-logo">
            <h2>SHOE STORE</h2>
            <p>Your one-stop destination for premium footwear</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Shop</Link></li>
              <li><a href="#">About Us</a></li>
              <li><a href="/#contact-section">Contact</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contact Info</h3>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i>Megenagna,zefmesh mall,409</li>
              <li><i className="fas fa-phone"></i> +(251)913653362</li>
              <li><i className="fas fa-envelope"></i> info@shoestore.com</li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3>Newsletter</h3>
            <p>Subscribe to our newsletter for the latest updates</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your Email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Shoe Store. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ProductPage;