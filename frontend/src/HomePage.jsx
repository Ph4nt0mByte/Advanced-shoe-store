import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Use refs for values that change frequently to avoid stale closures
  const scrollPositionRef = useRef(0);
  const scrollSpeedRef = useRef(0.5);
  const slideWidthRef = useRef(320);
  const totalSlidesRef = useRef(6);
  
  const slideshowRef = useRef(null);
  const trackRef = useRef(null);
  const animationRef = useRef(null);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    // Handle body overflow like in original JS
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Calculate slide width based on container width
  const calculateSlideWidth = () => {
    if (!slideshowRef.current) return;
    
    const containerWidth = slideshowRef.current.offsetWidth;
    if (containerWidth <= 600) {
      slideWidthRef.current = 240;
    } else if (containerWidth <= 900) {
      slideWidthRef.current = 290;
    } else {
      slideWidthRef.current = 320;
    }
  };

  // Update scroll position for infinite scroll
  const updateScrollPosition = () => {
    if (!trackRef.current || !isScrolling) return;
    
    const newPosition = scrollPositionRef.current - scrollSpeedRef.current;
    const resetPoint = -(totalSlidesRef.current * slideWidthRef.current);
    
    if (newPosition <= resetPoint) {
      scrollPositionRef.current = 0;
    } else {
      scrollPositionRef.current = newPosition;
    }
    
    trackRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
    
    animationRef.current = requestAnimationFrame(updateScrollPosition);
  };

  // Start infinite scroll
  const startInfiniteScroll = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    updateScrollPosition();
  };

  // Stop infinite scroll
  const stopInfiniteScroll = () => {
    setIsScrolling(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };



  // Handle slide navigation
  const plusSlides = (n) => {
    if (!trackRef.current) return;
    
    const currentPosition = scrollPositionRef.current;
    const slideWidth = slideWidthRef.current;
    const gap = 20; // Gap between slides
    const moveDistance = slideWidth + gap;
    
    if (n > 0) {
      // Move right (next)
      scrollPositionRef.current = currentPosition - moveDistance;
    } else {
      // Move left (previous)
      scrollPositionRef.current = currentPosition + moveDistance;
    }
    
    trackRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
  };

  // Touch handling for mobile
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      // Use the same logic as plusSlides
      if (!trackRef.current) return;
      
      const currentPosition = scrollPositionRef.current;
      const slideWidth = slideWidthRef.current;
      const gap = 20;
      const moveDistance = slideWidth + gap;
      
      if (diff > 0) {
        // Swipe left - move right (next)
        scrollPositionRef.current = currentPosition - moveDistance;
      } else {
        // Swipe right - move left (previous)
        scrollPositionRef.current = currentPosition + moveDistance;
      }
      
      trackRef.current.style.transform = `translateX(${scrollPositionRef.current}px)`;
    }
  };

  // Handle resize
  const handleResize = () => {
    calculateSlideWidth();
  };

  // Initialize slideshow
  useEffect(() => {
    const initSlideshow = () => {
      calculateSlideWidth();
      // Start scrolling after a short delay
      setTimeout(() => {
        startInfiniteScroll();
      }, 500);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initSlideshow();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle resize events
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="home-page">
      <video autoPlay muted className="backgroundVideo">
        <source src="/homepage/media/main-background.mp4" type="video/mp4" />
      </video>
      
      <section className="header" id="header-section">
        <div className="navigation">
          <div className="navbar">
            <div className="nav-left">
              <Link to="/products" className="nav-link">PRODUCTS</Link>
              <a href="#featured-section" className="nav-link">FEATURED</a>
              <a href="#footer-section" className="nav-link">ABOUT US</a>
            </div>
            
            <div className="nav-center">
              <Link to="/">
                <img src="/homepage/img/logo.png" alt="SHODES" className="logo" />
              </Link>
            </div>
            
            <div className="nav-right">
              <a href="#contact-section" className="nav-link">CONTACT</a>
              <Link to="/cart" className="cart-icon">
                <img src="/homepage/img/cart.svg" alt="Shopping Cart" className="cart-img" />
                <span className="cart-count" id="cartCount">0</span>
              </Link>
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
              <li><Link to="/products">Products</Link></li>
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
        <div 
          className="slideshow-container" 
          ref={slideshowRef}
          onMouseEnter={stopInfiniteScroll}
          onMouseLeave={startInfiniteScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}

        >
          <div className="slideshow-track" ref={trackRef}>
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
            {/* Duplicate slides for infinite scroll */}
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