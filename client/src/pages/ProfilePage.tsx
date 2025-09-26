// client/src/pages/ProfilePage.tsx (FINAL VERSION)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css'; // Use the CSS provided in the next step

// Define the shape of our user info object
interface UserInfo {
  token: string;
  user: { 
    id: string; 
    name: string; 
    email: string; 
    age?: number; 
    gender?: string; 
    profession?: string;
    heightCm?: number;
    currentWeightKg?: number;
    activityLevel?: string; 
    profilePicture?: string; // --- NEW FIELD ---
  };
}

// --- FALLBACK PROFILE IMAGE ---
const defaultProfilePic = 'https://i.imgur.com/kS55o8K.png'; // Placeholder for a generic user avatar

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profession, setProfession] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [currentWeightKg, setCurrentWeightKg] = useState('');
  const [activityLevel, setActivityLevel] = useState('Sedentary');
  
  // --- NEW STATE FOR PROFILE PICTURE ---
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedInfo: UserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);
      
      const user = parsedInfo.user;

      setName(user.name);
      setEmail(user.email);
      setAge(String(user.age || ''));
      setGender(user.gender || '');
      setProfession(user.profession || '');
      setHeightCm(String(user.heightCm || ''));
      setCurrentWeightKg(String(user.currentWeightKg || ''));
      setActivityLevel(user.activityLevel || 'Sedentary');
      
      // Initialize the URL for preview
      setProfilePictureUrl(user.profilePicture || defaultProfilePic);
      setLoading(false);

    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Handler for file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      // Create a local URL for instant preview
      setProfilePictureUrl(URL.createObjectURL(file)); 
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return;
    
    // --- CRUCIAL: Use FormData for File Uploads ---
    const formData = new FormData();
    
    // Append all text fields
    formData.append('name', name);
    formData.append('email', email);
    formData.append('age', String(age));
    formData.append('gender', gender);
    formData.append('profession', profession);
    formData.append('heightCm', heightCm);
    formData.append('currentWeightKg', currentWeightKg);
    formData.append('activityLevel', activityLevel);
    
    // Append the file if it exists
    if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);
    }
    
    try {
      const token = userInfo.token;
      
      // NOTE: Content-Type must NOT be set to application/json for FormData
      const config = { 
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // IMPORTANT: Let axios set this boundary
        } 
      };
      
      // Assumes your backend /api/users/profile route is updated with Multer middleware
      const { data } = await axios.put('http://localhost:5001/api/users/profile', formData, config);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      alert('Profile updated successfully!');
      
      // Clean up the local URL
      if (profilePictureFile) URL.revokeObjectURL(profilePictureUrl);

    } catch (error) {
      console.error(error);
      alert('Failed to update profile. Check server console and ensure Multer is installed.');
    }
  };

  if (loading) return <div className="profile-page-container">Loading...</div>;

  return (
    <div className="profile-page-container">
      <h1>Your Profile</h1>
      <form onSubmit={handleProfileUpdate} className="profile-form-grid">
        
        {/* --- LEFT COLUMN: PROFILE PICTURE --- */}
        <div className="profile-photo-column">
            <div className="profile-picture-container">
                <img src={profilePictureUrl} alt="Profile" className="profile-picture" />
            </div>
            
            <label htmlFor="profile-upload" className="upload-button">
                Change Picture
            </label>
            <input 
                id="profile-upload"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            {profilePictureFile && <p className="file-name">{profilePictureFile.name}</p>}
        </div>


        {/* --- RIGHT COLUMN: PROFILE DETAILS --- */}
        <div className="profile-details-column">
            
            <h2 className="section-title">Basic Information</h2>
            <div className="form-group"><label>Name:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="form-group"><label>Email:</label><input type="email" value={email} readOnly style={{backgroundColor: '#eee'}} /></div>
            <div className="form-group"><label>Age:</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} /></div>
            <div className="form-group"><label>Gender:</label><input type="text" value={gender} onChange={(e) => setGender(e.target.value)} /></div>
            <div className="form-group"><label>Profession:</label><input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} /></div>
            
            <h2 className="section-title">Physical Metrics</h2>
            
            <div className="form-group">
                <label>Height (cm):</label>
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g., 170" />
            </div>
            
            <div className="form-group">
                <label>Current Weight (Kg):</label>
                <input type="number" value={currentWeightKg} onChange={(e) => setCurrentWeightKg(e.target.value)} placeholder="e.g., 65.5" />
            </div>

            <h2 className="section-title">Wellness Plan</h2>
            
            <div className="form-group">
                <label>Activity Level:</label>
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                    <option value="Sedentary">Sedentary (desk job)</option>
                    <option value="Lightly Active">Lightly Active (light exercise)</option>
                    <option value="Moderately Active">Moderately Active (moderate exercise)</option>
                    <option value="Very Active">Very Active (daily intense exercise)</option>
                </select>
            </div>
            
            <button type="submit" className="update-button">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;