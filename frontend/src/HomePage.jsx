import React, { useState, useEffect } from 'react';
import './HomePage.css';

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const plusSlides = (n) => {
    setCurrentSlide(prev => {
      const totalSlides = 6; // Number of slides
      let newSlide = prev + n;
      
      // Handle circular navigation
      if (newSlide >= totalSlides) {
        newSlide = 0;
      } else if (newSlide < 0) {
        newSlide = totalSlides - 1;
      }
      
      return newSlide;
    });
  };

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      plusSlides(1);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="home-page">
      <video autoPlay muted className="backgroundVideo">
        <source src="/homepage/media/main-background.mp4" type="video/mp4" />
      </video>
      
      <section className="header" id="header-section">
        <div className="navigation">
          <div className="navbar">
            <div className="nav-left">
              <a href="../products_page/products.html" className="nav-link">PRODUCTS</a>
              <a href="#featured-section" className="nav-link">FEATURED</a>
              <a href="#footer-section" className="nav-link">ABOUT US</a>
            </div>
            
            <div className="nav-center">
              <img src="/homepage/img/logo.png" alt="SHODES" className="logo" />
            </div>
            
            <div className="nav-right">
              <a href="#contact-section" className="nav-link">CONTACT</a>
              <a href="../cart_page/cart.html" className="cart-icon">
                <img src="/homepage/img/cart.svg" alt="Shopping Cart" className="cart-img" />
                <span className="cart-count" id="cartCount">0</span>
              </a>
            </div>
          </div>
      
          <div className="hamburger" onClick={toggleMenu}>
            <img className="menu" src="/homepage/img/Menu.svg" alt="Menu" />
          </div>
          <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`} id="mobileMenu">
            <span className="close-btn" onClick={toggleMenu}>
              <i className="fas fa-times"></i>
            </span>
            <ul>
              <li><a href="../products_page/products.html">Products</a></li>
              <li><a href="#featured-section">Featured</a></li>
              <li><a href="#footer-section">About Us</a></li>
              <li><a href="#contact-section">Contact</a></li>
            </ul>
          </div>  
        </div>

        <div className="left-text">
          <h1>EVERY STEP</h1>
        </div>
        <div className="right-text">
          <h1>EVERY STYLE</h1>
        </div>
        
      </section>

      <section className="featured" id="featured-section">
        <div className="featured-header"> 
          <h2>Featured Collection</h2>
        </div>
        <div className="slideshow-container">
          <div className="slideshow-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            <div className="slides">
              <img src="https://cdn-images.farfetch-contents.com/22/19/20/86/22192086_51955423_1000.jpg" alt="Jordan" />
              <div className="text">JORDAN</div>
            </div>
            <div className="slides">
              <img src="https://cdn-images.farfetch-contents.com/20/49/94/58/20499458_50484173_1000.jpg" alt="Amiri" />
              <div className="text">AMIRI</div>
            </div>
            <div className="slides">
              <img src="https://cdn-images.farfetch-contents.com/30/04/81/66/30048166_59098074_1000.jpg" alt="Salomon" />
              <div className="text">SALOMON</div>
            </div>
            <div className="slides">
              <img src="https://cdn-images.farfetch-contents.com/26/08/27/43/26082743_57501365_1000.jpg" alt="Jimmy Choo" />
              <div className="text">JIMMY CHOO</div>
            </div>
            <div className="slides">
              <img src="https://cdn-images.farfetch-contents.com/30/57/10/11/30571011_59670238_1000.jpg" alt="Amiri" />
              <div className="text">AMIRI</div>
            </div>
            <div className="slides">
              <img src="https://cdn-images.farfetch-contents.com/30/61/77/58/30617758_59699763_1000.jpg" alt="Nike" />
              <div className="text">NIKE</div>
            </div>
          </div>
          <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
          <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>
        </div>
      </section>

      <section className="contact" id="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p>Have questions? We're here to help!</p>
            
            <div className="contact-method">
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>info@shoestore.com</p>
              </div>
            </div>
            
            <div className="contact-method">
              <i className="fas fa-phone"></i>
              <div>
                <h3>Phone</h3>
                <p>+(251)913653362</p>
              </div>
            </div>
            
            <div className="contact-method">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Location</h3>
                <p>Megenagna,zefmesh mall,409</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Send us a message</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="4" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>

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

export default HomePage;