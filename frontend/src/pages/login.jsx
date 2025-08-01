import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      if (data.user && data.user.admin) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        localStorage.removeItem('isAdmin');
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { name, email, password, password_confirmation: password } })
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const styles = {
    container: {
      fontFamily: '"Century Gothic", sans-serif',
      backgroundColor: '#1a1a1a',
      color: '#e7e7e7',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    authContainer: {
      backgroundColor: '#2d2d2d',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      width: '100%',
      maxWidth: '400px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    logoContainer: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    logo: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '2px'
    },
    authToggle: {
      display: 'flex',
      marginBottom: '30px',
      backgroundColor: '#333',
      borderRadius: '6px',
      overflow: 'hidden'
    },
    toggleBtn: {
      flex: 1,
      padding: '12px',
      backgroundColor: 'transparent',
      color: '#999',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      fontSize: '1rem'
    },
    toggleBtnActive: {
      backgroundColor: '#555',
      color: '#fff'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#b4b4b4',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #555',
      borderRadius: '6px',
      backgroundColor: '#333',
      color: '#fff',
      fontFamily: 'inherit',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease'
    },
    submitBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#555',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontFamily: 'inherit',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    backLink: {
      textAlign: 'center',
      marginTop: '20px'
    },
    backLinkA: {
      color: '#b4b4b4',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'color 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authContainer}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>Shoe Store</div>
        </div>

        <div style={styles.authToggle}>
          <button 
            style={isLogin ? { ...styles.toggleBtn, ...styles.toggleBtnActive } : styles.toggleBtn}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            style={!isLogin ? { ...styles.toggleBtn, ...styles.toggleBtnActive } : styles.toggleBtn}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label htmlFor="loginEmail" style={styles.label}>Email</label>
              <input 
                type="email" 
                id="loginEmail" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required 
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="loginPassword" style={styles.label}>Password</label>
              <input 
                type="password" 
                id="loginPassword" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required 
              />
            </div>
            <button type="submit" style={styles.submitBtn}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={styles.formGroup}>
              <label htmlFor="registerName" style={styles.label}>Full Name</label>
              <input 
                type="text" 
                id="registerName" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required 
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="registerEmail" style={styles.label}>Email</label>
              <input 
                type="email" 
                id="registerEmail" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required 
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="registerPassword" style={styles.label}>Password</label>
              <input 
                type="password" 
                id="registerPassword" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required 
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required 
              />
            </div>
            <button type="submit" style={styles.submitBtn}>Register</button>
          </form>
        )}

        <div style={styles.backLink}>
          <Link to="/" style={styles.backLinkA}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
           