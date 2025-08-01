import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems, getOrderSummary, clearCart } from '../utils/cart';
import '../styles/checkout.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, tax: 0, total: 0, itemCount: 0 });

  useEffect(() => {
    setCartItems(getCartItems());
    setSummary(getOrderSummary());
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleSubmit = (e) => {
    e.preventDefault();
    clearCart();
    alert('Thank you for your order!');
    navigate('/');
  };

  return (
    <>
      <div className="navigation">
        <div className="navbar">
          <div className="nav-left">
            <Link to="/products" className="nav-link">PRODUCTS</Link>
            <a href="/#featured-section" className="nav-link">FEATURED</a>
            <a href="/#footer-section" className="nav-link">ABOUT US</a>
          </div>
          <div className="nav-center">
            <img src="/homepage/img/logo.png" alt="SHOE STORE" className="logo" />
          </div>
          <div className="nav-right">
            <a href="/#contact-section" className="nav-link">CONTACT</a>
            <Link to="/cart" className="cart-icon">
              <img src="/homepage/img/cart.svg" alt="Shopping Cart" className="cart-img" />
              <span className="cart-count">{summary.itemCount}</span>
            </Link>
          </div>
        </div>
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <img className="menu" src="/homepage/img/Menu.svg" alt="Menu" />
        </button>
        <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`} id="mobileMenu">
          <span className="close-btn" onClick={toggleMenu}><i className="fas fa-times"></i></span>
          <ul>
            <li><Link to="/products" onClick={toggleMenu}>Products</Link></li>
            <li><a href="/#featured-section" onClick={toggleMenu}>Featured</a></li>
            <li><a href="/#footer-section" onClick={toggleMenu}>About Us</a></li>
            <li><a href="/#contact-section" onClick={toggleMenu}>Contact</a></li>
          </ul>
        </div>
      </div>

      <main className="checkout-main">
        <div className="checkout-container">
          <h1 className="checkout-title">Checkout</h1>
          <div className="checkout-content">
            <form className="checkout-form" id="checkoutForm" onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Customer Information</h2>
                <div className="form-group">
                  <label for="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName" required />
                </div>
                <div className="form-group">
                  <label for="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName" required />
                </div>
                <div className="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label for="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" required />
                </div>
              </div>

              <div className="form-section">
                <h2>Shipping Address</h2>
                <div className="form-group">
                  <label for="address">Address</label>
                  <input type="text" id="address" name="address" required />
                </div>
                <div className="form-group">
                  <label for="city">City</label>
                  <input type="text" id="city" name="city" required />
                </div>
                <div className="form-group">
                  <label for="state">State</label>
                  <input type="text" id="state" name="state" required />
                </div>
                <div className="form-group">
                  <label for="zip">ZIP Code</label>
                  <input type="text" id="zip" name="zip" required />
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Information</h2>
                <div className="form-group">
                  <label for="cardNumber">Card Number</label>
                  <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label for="expiry">Expiration Date</label>
                    <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="form-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="123" required />
                  </div>
                </div>
                <div className="form-group">
                  <label for="cardName">Name on Card</label>
                  <input type="text" id="cardName" name="cardName" required />
                </div>
              </div>

              <button type="submit" className="place-order-btn">Place Order</button>
            </form>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="cart-items-summary" id="cartItemsSummary">
  {cartItems.length === 0 ? (
    <div className="empty-cart">Your cart is empty.</div>
  ) : (
    cartItems.map((item) => (
      <div key={item.id} className="cart-item-summary">
        <span className="cart-item-name">{item.name}</span>
        <span className="cart-item-qty">x{item.quantity}</span>
        <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ))
  )}
</div>
<div className="summary-line">
  <span>Subtotal</span>
  <span id="subtotal">${summary.subtotal.toFixed(2)}</span>
</div>
<div className="summary-line">
  <span>Shipping</span>
  <span>Free</span>
</div>
<div className="summary-line">
  <span>Tax</span>
  <span id="tax">${summary.tax.toFixed(2)}</span>
</div>
<div className="summary-line total">
  <span>Total</span>
  <span id="total">${summary.total.toFixed(2)}</span>
</div>
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
              <li><a href="#header-section">Home</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#contact-section">Contact</a></li>
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
            <form className="newsletter-form">
              <input type="email" placeholder="Your Email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Shoe Store. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default CheckoutPage;