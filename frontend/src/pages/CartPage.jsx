import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CartPage.css';
import { 
  getCartItems,
  changeQuantity,
  removeItem,
  getOrderSummary,
  subscribe
} from '../utils/cart';
import '../pages/HomePage';

function CartPage() {
  const [cartItems, setCartItems] = useState(getCartItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState(getOrderSummary());

  // Initialize and subscribe to cart changes
  useEffect(() => {
    // Initial load
    setCartItems([...getCartItems()]);
    setOrderSummary(getOrderSummary());
    
    // Subscribe to future changes
    const unsubscribe = subscribe((updatedCart) => {
      setCartItems([...updatedCart]);
      setOrderSummary(getOrderSummary());
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleQuantityChange = (itemId, change, size) => {
    changeQuantity(itemId, change, size);
  };

  const handleRemoveItem = (itemId, size) => {
    removeItem(itemId, size);
  };

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      // Navigate to checkout page
      window.location.href = '/checkout';
    } else {
      alert('Your cart is empty. Add some items before checking out.');
    }
  };

  const { subtotal, tax, total } = orderSummary;

  const displayEmptyCart = () => (
    <div className="empty-cart">
      <h3>Your cart is empty</h3>
      <p>Add some shoes to get started!</p>
      <Link to="/products" className="continue-shopping-btn">Continue Shopping</Link>
    </div>
  );

  const renderCartItems = () => {
    if (cartItems.length === 0) {
      return displayEmptyCart();
    }

    return cartItems.map((item, index) => (
      <div key={`${item.id}-${item.size}-${index}`} className="cart-item">
        <div className="item-image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="item-details">
          <h3>{item.name}</h3>
          <p className="item-brand">{item.brand}</p>
          <p className="item-size">Size: {item.size}</p>
          {item.color && <p className="item-color">Color: {item.color}</p>}
        </div>
        <div className="item-quantity">
          <button 
            className="qty-btn minus" 
            onClick={() => handleQuantityChange(item.id, -1, item.size)}
          >
            -
          </button>
          <span className="qty-display">
            {item.quantity}
          </span>
          <button 
            className="qty-btn plus" 
            onClick={() => handleQuantityChange(item.id, 1, item.size)}
          >
            +
          </button>
        </div>
        <div className="item-price">
          <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <button 
          className="remove-btn" 
          onClick={() => handleRemoveItem(item.id, item.size)}
        >
          ×
        </button>
      </div>
    ));
  };

  return (
    <div className="cart-page">
        <div className="navigation">
          <div className="navbar">
            <div className="nav-left">
              <Link to="/products" className="nav-link">PRODUCTS</Link>
              <Link to="/#featured-section" className="nav-link">FEATURED</Link>
              <Link to="/#footer-section" className="nav-link">ABOUT US</Link>
            </div>

            <div className="nav-center">
              <Link to="/home">
                <img src="/cartpage/img/logo.png" alt="SHODES" className="logo" />
              </Link>
            </div>

            <div className="nav-right">
              <Link to="/home#contact-section" className="nav-link">CONTACT</Link>
              <Link to="/cart" className="cart-icon">
                <img src="/cartpage/img/cart.svg" alt="Shopping Cart" className="cart-img" />
                <span className="cart-count" id="cartCount">{cartItems.length}</span>
              </Link>
            </div>
          </div>

          <div className="hamburger" onClick={toggleMenu}>
            <img className="menu" src="/cartpage/img/Menu.svg" alt="Menu" />
          </div>
          <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`} id="mobileMenu">
            <span className="close-btn" onClick={toggleMenu}>
              <i className="fas fa-times"></i>
            </span>
            <ul>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/#featured-section">Featured</Link></li>
              <li><Link to="/#footer-section">About Us</Link></li>
              <li><Link to="/#contact-section">Contact</Link></li>
            </ul>
          </div>
        </div>

      <main className="cart-main">
        <div className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>
          
          <div className="cart-content">
            <div className="cart-items">
              {renderCartItems()}
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-line">
                <span>Subtotal</span>
                <span id="subtotal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-line">
                <span>Estimated tax</span>
                <span id="tax">${tax.toFixed(2)}</span>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <span id="total">${total.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </main>

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
              <li><Link to="/#header-section">Home</Link></li>
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/#footer-section">About Us</Link></li>
              <li><Link to="/#contact-section">Contact</Link></li>
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

export default CartPage;