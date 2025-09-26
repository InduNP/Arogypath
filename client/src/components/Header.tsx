import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

// --- 1. Import your new header logo ---
import headerLogo from '../assets/header-logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const storedUserInfo = localStorage.getItem('userInfo');
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <header className="header-container">
      {/* --- Section 1: The Logo on the Left --- */}
      <div className="header-logo">
        <Link to={userInfo ? "/dashboard" : "/"}>
          <img src={headerLogo} alt="ArogyaPath Logo" />
        </Link>
      </div>

      {/* --- Section 2: All Navigation on the Right --- */}
      <nav className="header-nav">
        {userInfo ? (
          // Logged-in view
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/diet-planner">Diet Planner</Link>
            <Link to="/analysis">Visual Assessment</Link>
            <Link to="/consult-experts">Consult Experts</Link> {/* <--- NEW LINK ADDED */}
            <Link to="/profile">Profile</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <button onClick={logoutHandler} className="logout-button">Logout</button>
          </>
        ) : (
          // Logged-out view
          <>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;