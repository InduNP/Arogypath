import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import DietPlannerPage from './pages/DietPlannerPage';
import AnalysisPage from './pages/AnalysisPage';

// --- 1. IMPORT THE NEW PAGES ---
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ConsultExpertsPage from './pages/ConsultExpertsPage'; // <--- NEW IMPORT

// Make sure you are importing your global stylesheet here
import './App.css'; // Or './index.css' depending on your project setup

const App: React.FC = () => {
  return (
    <Router>
      {/* 
        This wrapper div is the key to our full-screen layout.
        It allows our CSS to make the container 100% of the screen height.
      */}
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/diet-planner" element={<DietPlannerPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            
            {/* --- 2. ADD THE NEW ROUTES HERE --- */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/consult-experts" element={<ConsultExpertsPage />} /> {/* <--- NEW ROUTE ADDED */}

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;