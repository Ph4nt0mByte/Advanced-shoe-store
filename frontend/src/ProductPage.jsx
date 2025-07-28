import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ProductPage.css';

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
      const response = await fetch('/api/products'); // Update this to your actual API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      const processedProducts = data.map((product, index) => ({
        id: product.id,
        name: product.name,
        brand: product.name.toLowerCase().includes('jordan') ? 'jordan' : 
               product.name.toLowerCase().includes('nike') ? 'nike' :
               product.name.toLowerCase().includes('adidas') ? 'adidas' :
               product.name.toLowerCase().includes('puma') ? 'puma' :
               product.name.toLowerCase().includes('converse') ? 'converse' :
               product.name.toLowerCase().includes('salomon') ? 'salomon' :
               product.name.toLowerCase().includes('vans') ? 'vans' : 'other',
        price: parseFloat(product.price),
        category: product.name.toLowerCase().includes('air') ? 'basketball' :
                 product.name.toLowerCase().includes('ultraboost') ? 'running' :
                 product.name.toLowerCase().includes('skate') ? 'skate' : 'casual',
        images: [product.image],
        description: product.description || 'No description available',
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["#000000", "#FFFFFF", "#FF0000"]
      }));
      
      setProducts(processedProducts);
      setFilteredProducts(processedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // For demo purposes, let's create some sample products
      const sampleProducts = [
        {
          id: 1,
          name: "Nike Air Jordan 1",
          brand: "jordan",
          price: 180,
          category: "basketball",
          images: ["https://cdn-images.farfetch-contents.com/22/19/20/86/22192086_51955423_1000.jpg"],
          description: "Classic basketball sneaker with premium leather construction",
          sizes: ["7", "8", "9", "10", "11", "12"],
          colors: ["#000000", "#FFFFFF", "#FF0000"]
        },
        {
          id: 2,
          name: "Adidas Ultraboost 22",
          brand: "adidas",
          price: 190,
          category: "running",
          images: ["https://cdn-images.farfetch-contents.com/20/49/94/58/20499458_50484173_1000.jpg"],
          description: "Premium running shoe with responsive cushioning",
          sizes: ["7", "8", "9", "10", "11", "12"],
          colors: ["#000000", "#FFFFFF", "#FF0000"]
        },
        {
          id: 3,
          name: "Nike Air Max 270",
          brand: "nike",
          price: 150,
          category: "casual",
          images: ["https://cdn-images.farfetch-contents.com/30/04/81/66/30048166_59098074_1000.jpg"],
          description: "Comfortable everyday sneaker with Air Max technology",
          sizes: ["7", "8", "9", "10", "11", "12"],
          colors: ["#000000", "#FFFFFF", "#FF0000"]
        }
      ];
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
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
  const addToCart = () => {
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

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    closeModal();
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

    addToCart();
    // Navigate to cart page (you'll need to implement routing)
    window.location.href = '/cart';
  };

  // Update cart count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
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
            <Link to="/">
              <img src="/productpage/img/logo.png" alt="SHODES" className="logo" />
            </Link>
          </div>

          <div className="nav-right">
            <a href="/#contact-section" className="nav-link">CONTACT</a>
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
                      e.target.src = `https://via.placeholder.com/250x200?text=${product.name}`;
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
                  <button className="add-to-cart-btn" onClick={addToCart}>
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