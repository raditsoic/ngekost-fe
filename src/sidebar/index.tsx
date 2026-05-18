import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './style.css';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="otter-logo-circle" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
          <h2>Menu</h2>
          <button className="close-btn" onClick={toggleSidebar}>×</button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/chat" className={`sidebar-link ${location.pathname === '/chat' ? 'active' : ''}`} onClick={toggleSidebar}>
             Chat
          </Link>
          <Link to="/catalogue" className={`sidebar-link ${location.pathname === '/catalogue' ? 'active' : ''}`} onClick={toggleSidebar}>
             Catalogue
          </Link>
          <Link to="/financial" className={`sidebar-link ${location.pathname === '/financial' ? 'active' : ''}`} onClick={toggleSidebar}>
             Financial Tracker
          </Link>
        </nav>
      </div>
    </>
  );
};
