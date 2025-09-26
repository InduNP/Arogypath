import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

// --- Placeholder Images (Assuming you create these assets) ---
// Save your images to client/src/assets/
import balanceImage from '../assets/ayurvedic-bg.png'; // Use a generic background image for balance/wellness
// Removed unused import: import doshaChart from '../assets/dosha-chart.png'; 


const AboutPage: React.FC = () => {
  return (
    <div className="about-page-container">
      <div className="content-wrapper">
        
        {/* --- SECTION 1: HERO/MISSION --- */}
        <section className="about-section mission-hero">
          <h1 className="about-headline">About ArogyaPath</h1>
          <hr className="headline-underline" />
          
          <div className="mission-content">
            <p className="mission-statement">
              **ArogyaPath** is dedicated to bringing the timeless wisdom of Ayurveda into the modern world. Our mission is to empower individuals to achieve holistic health and balance through personalized, accessible, and authentic wellness tools.
            </p>
            <p>
              We believe that the path to wellness is unique for everyone. By leveraging technology to provide tailored dietary recommendations and visual wellness assessments, we aim to make the profound principles of Ayurveda a practical part of your daily life.
            </p>
          </div>
        </section>
        
        {/* --- SECTION 2: VISION AND TECHNOLOGY (Two-Column Layout) --- */}
        <section className="about-section vision-tech-section">
          <div className="vision-text-block">
            <h2 className="section-title">Our Vision: Personalized Wellness</h2>
            <p>
              Traditional Ayurvedic consultations are powerful but often inaccessible. ArogyaPath bridges this gap by using a detailed, multi-point assessment to determine your unique Dosha (Prakriti) and current imbalances (Vikriti). Our plans are never one-size-fits-all.
            </p>
            <p>
              We use a sophisticated engine to instantly process your body type, digestion, energy levels, and stress profile, creating an immediate, actionable guide to align your diet and lifestyle with your inner constitution.
            </p>
            <h2 className="section-title mt-4">The Power of Technology</h2>
            <p>
              Our platform is built on cutting-edge AI and data analysis, meticulously trained by certified Ayurvedic experts. This ensures the accuracy and authenticity of every recommendation, giving you a reliable partner on your journey to lasting well-being.
            </p>
          </div>

          <div className="vision-image-block">
            <img 
              src={balanceImage} 
              alt="Ayurvedic herbs and ingredients symbolizing balance" 
              className="about-image" 
            />
          </div>
        </section>

        {/* --- SECTION 3: KEY PRINCIPLES (Chart Style) --- */}
        <section className="about-section principles-section">
          <h2 className="section-title center-text">Why Choose Our Ayurvedic Approach?</h2>
          <div className="principles-grid">
            <div className="principle-box">
              <h3>Rooted in Prakriti</h3>
              <p>We focus on your unique constitution (Vata, Pitta, Kapha) for truly personalized guidance.</p>
            </div>
            <div className="principle-box">
              <h3>Focus on Agni (Digestive Fire)</h3>
              <p>Every recommendation is designed to strengthen your digestive power, the root of all health in Ayurveda.</p>
            </div>
            <div className="principle-box">
              <h3>Actionable Dina Charya</h3>
              <p>Our plans include daily routine tips (like waking/sleeping times) for holistic, 24-hour balance.</p>
            </div>
            <div className="principle-box">
              <h3>Consultation Bridge</h3>
              <p>The platform provides data you can use to have more productive, informed sessions with our listed Ayurvedic doctors.</p>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: CALL TO ACTION --- */}
        <section className="about-section cta-section">
            <h2 className="section-title center-text">Ready to Find Your Balance?</h2>
            <Link to="/diet-planner" className="cta-button">
                Start Your Free Personalized Diet Plan
            </Link>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;