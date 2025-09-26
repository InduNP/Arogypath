import React, { useState, useMemo } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom'; // Added navigate for consistency
import './DietPlannerPage.css';

// --- 1. UPDATED DATA STRUCTURE (Added digestion and stress fields) ---
interface FormData {
  age: string;
  gender: string;
  prakriti: string;
  healthGoals: string;
  activityLevel: string;
  dietaryPreferences: string;
  // --- NEW REQUIRED FIELDS ---
  digestion: string;
  stress: string;
  // --- END NEW REQUIRED FIELDS ---
  extraDetails: string;
}

// --- 2. QUESTIONNAIRE DATA (Expanded to 6 core questions) ---
const questionsData = [
  // Q1. MAPPED TO: prakriti
  {
    "id": "prakriti",
    "question": "1. My physical body frame is best described as:",
    "options": [
      {"text": "Thin and light; I find it difficult to gain weight.", "dosha": "Vata"},
      {"text": "Medium and athletic; I build muscle with relative ease.", "dosha": "Pitta"},
      {"text": "Broad and sturdy; I tend to gain weight easily.", "dosha": "Kapha"},
      {"text": "A combination of two of the above.", "dosha": "Mixed"}
    ]
  },
  // Q2. MAPPED TO: healthGoals
  {
    "id": "healthGoals",
    "question": "2. What is your primary health goal?",
    "options": [
      {"text": "Manage weight.", "goal": "weight"},
      {"text": "Improve digestion.", "goal": "digestion"},
      {"text": "Increase energy.", "goal": "energy"},
      {"text": "Manage stress.", "goal": "stress"},
      {"text": "Overall wellness & immunity.", "goal": "immunity"}
    ]
  },
  // Q3. MAPPED TO: digestion (New Field)
  {
    "id": "digestion",
    "question": "3. My digestion tends to be:",
    "options": [
      {"text": "Prone to gas, bloating, and inconsistent.", "dosha": "Vata"},
      {"text": "Strong but can cause acidity or heartburn.", "dosha": "Pitta"},
      {"text": "Slow and heavy; I feel full long after eating.", "dosha": "Kapha"},
      {"text": "Usually reliable.", "dosha": "Mixed"}
    ]
  },
  // Q4. MAPPED TO: stress (New Field)
  {
    "id": "stress",
    "question": "4. How stressed do you feel?",
    "options": [
      {"text": "Low.", "stress": "low"},
      {"text": "Moderate.", "stress": "medium"},
      {"text": "High.", "stress": "high"},
      {"text": "Very high.", "stress": "very_high"}
    ]
  },

  {
    "id": "prakriti5",
    "question": "5. My skin typically tends to be:",
    "options": [
      {"text": "Dry, thin, and feels cool to the touch", "dosha": "Vata"},
      {"text": "Sensitive, warm, prone to redness or acne.", "dosha": "Pitta"},
      {"text": "Thick, smooth, oily, and well-hydrated.", "dosha": "Kapha"},
      {"text": "Combination skin that varies.", "dosha": "Mixed"}
    ]
  },

  // Q5. MAPPED TO: activityLevel
  {
    "id": "activityLevel",
    "question": "6. My profession or daily activity involves:",
    "options": [
      {"text": "Mostly sitting (desk job, driving).", "activity": "sedentary"},
      {"text": "Mix of sitting and moving (teaching, housework).", "activity": "moderate"},
      {"text": "Mostly standing/active work (construction, fitness).", "activity": "active"},
      {"text": "Work from home with variable routine.", "activity": "mixed"}
    ]
  },

  {
    "id": "Thin",
    "question": "7. My hair texture is naturally:",
    "options": [
      {"text": "Dry, thin, brittle, or frizzy.", "dosha": "Vata"},
      {"text": "Fine, straight, prone to early graying.", "dosha": "Pitta"},
      {"text": "Thick, wavy, strong, and often oily.", "dosha": "Kapha"},
      {"text": "Generally average.", "dosha": "Mixed"}
    ]
  },

  {
    "id": "body",
    "question": "8. My appetite and eating habits are:",
    "options": [
      {"text": "Irregular; I sometimes forget to eat.", "dosha": "Vata"},
      {"text": "Strong and sharp; I get irritable if I miss a meal.", "dosha": "Pitta"},
      {"text": "Slow and steady; I can easily skip a meal.", "dosha": "Kapha"},
      {"text": "Generally regular and moderate.", "dosha": "Mixed"}
    ]
  },

  {
    "id": "prakriti2",
    "question": "9.My energy pattern throughout the day is typically:",
    "options": [
      {"text": "Quick bursts, then fatigue.", "dosha": "Vata"},
      {"text": "Focused and intense.", "dosha": "Pitta"},
      {"text": "Steady and consistent.", "dosha": "Kapha"},
      {"text": "Highly variable.", "dosha": "Mixed"}
    ]
  },
  {
    "id": "prakriti3",
    "question": "10. My sleep is usually:",
    "options": [
      {"text": "Light and easily disturbed.", "dosha": "Vata"},
      {"text": "Sound and restful but I may wake up hot.", "dosha": "Pitta"},
      {"text": "Deep and heavy; hard to wake up.", "dosha": "Kapha"},
      {"text": "Generally good.", "dosha": "Mixed"}
    ]
  },
  {
    "id": "prakriti11",
    "question": "11. My profession or daily activity involves:",
    "options": [
      {"text": "Mostly sitting (desk job, driving).", "activity": "sedentary"},
      {"text": "Mix of sitting and moving (teaching, housework).", "activity": "moderate"},
      {"text": "Mostly standing/active work (construction, fitness).", "activity": "active"},
      {"text": "Work from home with variable routine.", "activity": "mixed"}
    ]
  },
  {
    "id": "prakriti12",
    "question": "12. How often do you exercise?",
    "options": [
      {"text": "Rarely or never.", "exercise": "low"},
      {"text": "1-2 times per week.", "exercise": "light"},
      {"text": "3-4 times per week.", "exercise": "moderate"},
      {"text": "5 or more times per week.", "exercise": "high"}
    ]
  },
  {
    "id": "prakriti13",
    "question": "13. When stressed, I usually:",
    "options": [
      {"text": "Become anxious, mind races.", "dosha": "Vata"},
      {"text": "Become irritable, angry.", "dosha": "Pitta"},
      {"text": "Withdraw, crave comfort food.", "dosha": "Kapha"},
      {"text": "Reaction is unpredictable.", "dosha": "Mixed"}
    ]
  },

  {
    "id": "prakriti14",
    "question": "14. Do you follow a dietary pattern?",
    "options": [
      {"text": "Vegetarian", "diet": "vegetarian"},
      {"text": "Vegan", "diet": "vegan"},
      {"text": "Non-Vegetarian", "diet": "non-vegetarian"},
      {"text": "Eggetarian", "diet": "eggetarian"}
    ]
  },


  {
    "id": "prakriti15",
    "question": "15. Are there foods you dislike or avoid?",
    "options": [
      {"text": "Dairy", "avoid": "dairy"},
      {"text": "Spicy", "avoid": "spicy"},
      {"text": "Fried", "avoid": "fried"},
      {"text": "Sweets", "avoid": "sugar"},
      {"text": "Meat", "avoid": "meat"},
      {"text": "Gluten", "avoid": "gluten"},
      {"text": "None", "avoid": null}
    ]
  },

  {
    "id": "prakriti16",
    "question": "16. Do you have allergies/restrictions? ",
    "options": [
      {"text": "Yes (specify).", "allergy": "custom"},
      {"text": "No.", "allergy": null}
    ]
  },

  {
    "id": "prakriti17",
    "question": "17. How many meals do you prefer per day? ",
    "options": [
      {"text": "2 meals", "meals": 2},
      {"text": "3 meals", "meals": 3},
      {"text": "4-5 small meals", "meals": 5}
    ]
  },




  // Q6. MAPPED TO: dietaryPreferences

  
  {
    "id": "dietaryPreferences",
    "question": "18. Do you follow a dietary pattern?",
    "options": [
      {"text": "Vegetarian", "diet": "vegetarian"},
      {"text": "Vegan", "diet": "vegan"},
      {"text": "Non-Vegetarian", "diet": "non-vegetarian"},
      {"text": "Eggetarian", "diet": "eggetarian"}
    ]
  },
];

const DietPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    age: '', // Retain a default for safety, user can change
    gender: '', // Retain a default for safety, user can change
    prakriti: '',
    healthGoals: '',
    digestion: '', // NEW
    stress: '', // NEW
    activityLevel: '',
    dietaryPreferences: '',
    extraDetails: '',

  });

  const [dietPlan, setDietPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dietPlanRef = React.useRef<HTMLDivElement>(null);

  // UPDATED: Check the two new required fields
  const isFormComplete = useMemo(() => {
    return (
      formData.prakriti &&
      formData.healthGoals &&
      formData.digestion && // NEW CHECK
      formData.stress && // NEW CHECK
      formData.activityLevel &&
      formData.dietaryPreferences &&
      formData.gender &&
      formData.age
    );
  }, [formData]);

  const handleOptionClick = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // NOTE: The 'name' must match a key in FormData
    setFormData((prev) => ({ ...prev, [name as keyof FormData]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) {
      setError('Please answer all required questions.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setDietPlan('');
    
    // NOTE: Assuming your backend can handle the simple key/value pairs
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      const token = storedUserInfo ? JSON.parse(storedUserInfo).token : null;
      if (!token) throw new Error('Authentication token not found.');
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const { data } = await axios.post('/api/diet/generate', formData, config);
      setDietPlan(data.dietPlan);
    } catch (err: unknown) {
      let message = 'An unexpected error occurred.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = dietPlanRef.current;
    if (element) {
      const opt = {
        margin: 10,
        filename: 'ArogyaPath-Diet-Plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // --- THE DEFINITIVE LINTER-FRIENDLY FIX ---
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (html2pdf().from(element) as any).set(opt).save();
    }
  };
  
  const navigateToExperts = () => {
    navigate('/consult-experts');
  };

  // Render options using the string field key (keyof FormData)
  const renderOptions = (field: keyof FormData, options: { text: string }[]) => (
    <div className="options-container">
      {options.map((option) => (
        <button 
          type="button" 
          key={option.text} 
          className={`option-button ${formData[field] === option.text ? 'selected' : ''}`} 
          onClick={() => handleOptionClick(field, option.text)}
        >
          {option.text}
        </button>
      ))}
    </div>
  );

  return (
    <div className="diet-planner-container">
      <h2>Your Personalized Ayurvedic Diet Planner</h2>
      
      {!dietPlan ? (
        <form onSubmit={handleSubmit} className="questionnaire-form">
          <p className="intro-text">Answer the questions below to generate your personalized plan.</p>
          
          {/* --- RENDER THE 6 EXPANDED CORE QUESTIONS (Q1-Q6) --- */}
          {questionsData.map((q, index) => (
            <div className="question-block" key={index}>
              <label>{q.question}</label>
              {/* NOTE: q.id is a string matching a key in FormData */}
              {renderOptions(q.id as keyof FormData, q.options)}
            </div>
          ))}
          
          {/* --- AGE AND GENDER (Q7 & Q8 Logic) --- */}
          <div className="question-block-inline">
            <div className="inline-field">
              <label htmlFor="age">19. Your Age:</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleTextChange} required />
            </div>
            <div className="inline-field">
              <label htmlFor="gender">. Your Gender:</label>
               <div className="options-container">
                 {/* Gender options are fixed strings, matching the FormData keys */}
                 {['Male', 'Female', 'Other'].map((option) => (
                    <button 
                      type="button" 
                      key={option} 
                      className={`option-button ${formData.gender === option ? 'selected' : ''}`} 
                      onClick={() => handleOptionClick('gender', option)}
                    >
                      {option}
                    </button>
                  ))}
               </div>
            </div>
          </div>
          
          {/* --- EXTRA DETAILS (Q9 Logic) --- */}
          <div className="question-block">
            <label htmlFor="extraDetails">9. Any allergies or details to add? (optional)</label>
            <textarea id="extraDetails" name="extraDetails" value={formData.extraDetails} onChange={handleTextChange} placeholder="e.g., allergic to peanuts, dislike spinach..." />
          </div>
          
          <div className="generate-section">
            <button type="submit" className="generate-button" disabled={!isFormComplete || isLoading}>
              {isLoading ? 'Generating...' : 'Generate a Diet Chart'}
            </button>
            {!isFormComplete && !isLoading && <p className="form-incomplete-message">Please answer all questions to enable generation.</p>}
          </div>
        </form>
      ) : (
        <>
          <div className="diet-plan-result" ref={dietPlanRef}>
            <ReactMarkdown>{dietPlan}</ReactMarkdown>
          </div>
          <div className="result-actions">
            <button onClick={handleDownload} className="download-button">Download as PDF</button>
            <button onClick={navigateToExperts} className="consult-experts-button">Consult an Expert</button>
            <button onClick={() => setDietPlan('')} className="generate-button">Generate a New Plan</button>
          </div>
        </>
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DietPlannerPage;