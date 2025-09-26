import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Use the new, simple file name here
import logo from '../assets/ayurveda-logo.png';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-hero-container">
      <div className="hero-content">
        <img src={logo} alt="Ayurvedic Wellness Logo" className="hero-logo" />

        <h1 className="hero-headline">
          Achieve Balance with Personalized Ayurvedic Wellness
        </h1>
        <p className="hero-subheadline">
          Get diet plans tailored to your unique body constitution and receive wellness insights through visual assessment. Your journey to holistic health starts here.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="hero-button primary">
            Get Started
          </Link>
          <Link to="/login" className="hero-button secondary">
            I Already Have an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;