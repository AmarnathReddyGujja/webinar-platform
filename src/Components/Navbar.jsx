import { Link, useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import './navbar.css';
import { Home, Video, PlusCircle, MessageCircle, LogOut, User, Menu, X } from 'lucide-react';
import { AuthContext } from './AuthContext';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (isOpen && !e.target.closest('.navbar')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    return () => setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
    setIsOpen(false);
  };

  const handleDashboardClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      alert('Please log in to view your dashboard.');
    }
    setIsOpen(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-header">
        <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
          Webinars
        </Link>
        <button className="hamburger" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`nav-links ${isOpen ? 'active' : ''}`}>
        <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
          <Home size={18} />
          <span>Home</span>
        </Link>
        
        <Link className="nav-link" to="/Webinars" onClick={() => setIsOpen(false)}>
          <Video size={18} />
          <span>Webinars</span>
        </Link>
        
        <Link className="nav-link" to="/AddWebinar" onClick={() => setIsOpen(false)}>
          <PlusCircle size={18} />
          <span>Add Webinar</span>
        </Link>
        
        <Link className="nav-link" to="/ContactUS" onClick={() => setIsOpen(false)}>
          <MessageCircle size={18} />
          <span>Contact Us</span>
        </Link>
        
        <button className="nav-link" onClick={handleDashboardClick}>
          <User size={18} />
          <span>Dashboard</span>
        </button>
        
        {user ? (
          <button className="nav-link logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        ) : (
          <Link className="nav-link" to="/login" onClick={() => setIsOpen(false)}>
            <User size={18} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
