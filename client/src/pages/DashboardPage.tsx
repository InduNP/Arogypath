// client/src/pages/DashboardPage.tsx

import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import './DashboardPage.css'; 

// We no longer need the wellnessIcon import for the JSX/style block
// import wellnessIcon from '../assets/wellness_meditation_logo.png'; 

// --- Interface defining the expected USER INFO structure ---
interface UserState {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        prakriti?: string; 
    }
}

const ayurvedicTips = [
    { title: "Dinacharya (Daily Routine)", text: "Wake up before sunrise (Brahma Muhurta). Scrape your tongue, cleanse your face, and drink a glass of warm water to awaken Agni (digestive fire)." },
    { title: "Proper Hydration", text: "Sip warm water throughout the day, avoiding cold or ice water, as it dampens Agni and slows digestion. Drinking in small sips is key." },
    { title: "Eating Habits (Agni Focus)", text: "Eat your largest meal at midday when your Agni is strongest. Avoid eating when anxious or rushed, and always sit down to eat." },
    { title: "Seasonality (Ritucharya)", text: "Adjust your diet to the seasons. Favor cooling foods in summer (Pitta season) and warming, nourishing foods in winter (Vata/Kapha season)." },
    { title: "Triphala", text: "A powerful combination of three fruits (Amalaki, Bibhitaki, Haritaki). Often used to gently cleanse the colon, support digestion, and balance all three Doshas." },
    { title: "Importance of Sleep", text: "Be asleep before 10 PM. The Pitta energy is high between 10 PM and 2 AM, and if you are awake, you risk tapping into this energy and disturbing your body's natural cleansing cycle." },
    { title: "Meditation & Breath", text: "Incorporate a few minutes of meditation or mindful breathing (Pranayama) into your morning and evening routines to calm the nervous system (Vata)." },
];


const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserState | null>(null); 
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        (async () => {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (!storedUserInfo) {
                navigate('/login'); 
                return;
            }
            
            const parsedInfo: UserState = JSON.parse(storedUserInfo);
            setUserInfo(parsedInfo); 
            setIsLoading(false); 
        })(); 
        
    }, [navigate]); 

    const userName = userInfo?.user?.name || 'Wellness User';
    const userPrakriti = userInfo?.user?.prakriti || 'Balance'; 

    if (isLoading || !userInfo) {
        return (
            <div className="dashboard-page-container" style={{ textAlign: 'center', marginTop: '150px' }}>
                <h1>Loading your Ayurvedic Resources...</h1>
            </div>
        );
    }

    return (
        <div className="dashboard-page-container simple-scroll-layout">
            
            {/* --- 1. Welcome Banner --- */}
            <div className="dashboard-welcome-banner">
                <h1>Welcome, {userName}!</h1>
                <p>Start your journey to **{userPrakriti}** with these core Ayurvedic insights.</p>
            </div>

            {/* --- 2. Main Scrollable Content Card --- */}
            <div className="dashboard-card main-tips-card">
                <h2 className="card-title">Essential Ayurvedic Wisdom</h2>
                
                {ayurvedicTips.map((tip, index) => (
                    <div key={index} className="tip-item">
                        <h3 className="tip-title">{tip.title}</h3>
                        <p className="tip-text">{tip.text}</p>
                    </div>
                ))}
                
                {/* --- Call to Action at the bottom --- */}
                <div className="bottom-cta-section">
                    <Link to="/diet-planner" className="btn btn-primary-green">Start Your Personalized Diet Plan</Link>
                </div>
            </div>

            {/* --- 3. The problematic style block has been removed --- */}
        </div>
    );
};

export default DashboardPage;