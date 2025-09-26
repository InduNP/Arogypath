import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ConsultExpertsPage.css';

// --- DATA: Expert/Doctor Listings with Phone Numbers ---
const expertsData = [
  {
    id: 1,
    name: 'K K AYURVEDIC MEDICINES ACUPRESSURE CHIROPRACTIC & PHYSIOTHERAPY CARE CENTRE',
    specialty: 'Physiotherapists, Ayurvedic Doctors',
    rating: 4.8,
    ratingsCount: 19,
    location: 'Purhiran, Hoshiarpur',
    experience: '20 Years in Healthcare',
    status: 'Available Now',
    fee: null,
    phoneNumber: '+919876543210', 
  },
  {
    id: 2,
    name: 'Dr. Sudhir Taneja',
    specialty: 'Skin Care Clinics, Sexologist Doctors',
    rating: 5.0,
    ratingsCount: 463,
    location: 'Yamuna Nagar, Yamunanagar',
    experience: '17 Years in Healthcare',
    status: 'Consultation Fee: ₹ 100',
    fee: 100,
    phoneNumber: '+919988776655',
  },
  {
    id: 3,
    name: 'Life Care Clinic (Dr Himanshu Grover)',
    specialty: 'Clinics, Skin Care Clinics',
    rating: 4.9,
    ratingsCount: 417,
    location: 'Model Colony, Yamunanagar',
    experience: '13 Years in Healthcare',
    status: 'Claimed', // Keeping original data, but replacing display in render
    fee: null,
    phoneNumber: '+919765432109',
  },
  {
    id: 4,
    name: 'Dr. Sham Kaushik',
    specialty: 'Ayurvedic Doctors, Ayurvedic Doctors For Nadi Pariksha',
    rating: 5.0,
    ratingsCount: 1,
    location: 'Workshop Road, Yamunanagar',
    experience: '14 Years in Healthcare',
    status: 'Claimed', // Keeping original data, but replacing display in render
    fee: null,
    phoneNumber: '+919654321098',
  },
  {
    id: 5,
    name: 'Dr Rana',
    specialty: 'Sexologist Doctors, Sexologist Doctors For Male',
    rating: 5.0,
    ratingsCount: 11,
    location: 'Yamuna Nagar, Yamunanagar',
    experience: '10 Years in Healthcare',
    status: 'Open 24 Hrs',
    fee: null,
    phoneNumber: '+919543210987',
  },
];

// List of filter specialties
const allSpecialties = ['All', 'Ayurvedic Doctors', 'Physiotherapists', 'Skin Care Clinics', 'Sexologist Doctors'];

const ConsultExpertsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const filteredExperts = useMemo(() => {
    return expertsData.filter(expert => {
      // 1. Filter by Specialty
      const specialtyMatch = selectedSpecialty === 'All' || expert.specialty.includes(selectedSpecialty);

      // 2. Filter by Search Term (Name or Specialty or Location)
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = !searchTerm || 
        expert.name.toLowerCase().includes(searchLower) ||
        expert.specialty.toLowerCase().includes(searchLower) ||
        expert.location.toLowerCase().includes(searchLower);

      return specialtyMatch && searchMatch;
    });
  }, [searchTerm, selectedSpecialty]);

  const getStatusDisplay = (status: string) => {
    if (status === 'Claimed') return 'Profile Verified';
    return status;
  };

  return (
    <div className="experts-container">
      <h2>Consult Our Recommended Health Experts</h2>
      <p className="intro-text">
        Connect with highly-rated Physiotherapists, Ayurvedic Doctors, and Specialists in your region.
      </p>

      {/* --- FILTER AND SEARCH BAR --- */}
      <div className="search-filter-controls">
        <input
          type="text"
          placeholder="Search by name, specialty, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="expert-search-input"
        />
        
        <div className="specialty-filters">
          {allSpecialties.map(spec => (
            <button
              key={spec}
              className={`filter-button ${selectedSpecialty === spec ? 'filter-selected' : ''}`}
              onClick={() => setSelectedSpecialty(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
      {/* --- END FILTER AND SEARCH BAR --- */}

      <div className="experts-list">
        {filteredExperts.length > 0 ? (
          filteredExperts.map((expert) => (
            <div className="expert-card" key={expert.id}>
              <div className="expert-header">
                <h3 className="expert-name">{expert.name}</h3>
                <div className="expert-rating">
                  {/* Display rating with the star icon */}
                  <span className="rating-score">{expert.rating} ★</span> 
                  <span className="rating-count">({expert.ratingsCount} Ratings)</span>
                </div>
              </div>

              <p className="expert-specialty">Specialties: {expert.specialty}</p>
              <p className="expert-location">Location: {expert.location}</p>
              <p className="expert-experience">Experience: {expert.experience}</p>

              <div className="expert-footer">
                <span className={`expert-status ${expert.status.includes('Available') ? 'status-available' : expert.status.includes('Fee') ? 'status-fee' : 'status-claimed'}`}>
                  {getStatusDisplay(expert.status)}
                </span>
                
                {/* --- TELEPHONE LINK FOR BOOKING --- */}
                <a 
                    href={`tel:${expert.phoneNumber}`} 
                    className="consult-button"
                >
                    Call to Book
                </a>
                {/* --- END TELEPHONE LINK --- */}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results-message">No experts found matching your criteria.</p>
        )}
      </div>
      
      <Link to="/diet-planner" className="back-link">← Back to Diet Planner</Link>
    </div>
  );
};

export default ConsultExpertsPage;