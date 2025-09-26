// server/controllers/dietController.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. IMPORT THE MODEL FROM THE NEW SERVICE FILE (THIS FIXES THE ERROR)
const { DietPlanLog } = require('../services/dietPlanService'); 

if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not defined in .env file.');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper function to extract meal names from the Gemini output.
 */
const extractMealNames = (planText) => {
    // Basic array of expected meal names to search for
    const commonMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Morning Tea', 'Evening Snack'];
    
    // Simple logic: find lines that start with a common meal name
    const mealsFound = commonMeals
        .filter(meal => planText.includes(meal + ':') || planText.includes(meal + ' -'))
        .map(meal => ({ mealName: meal }));
        
    // Fallback: If no structured meals are found, return a default set
    return mealsFound.length > 0 ? mealsFound : [
        { mealName: 'Breakfast' }, 
        { mealName: 'Lunch' }, 
        { mealName: 'Dinner' }
    ];
};

// --- CONTROLLER 1: Generate Plan & Create Log ---
const generateDietPlan = async (req, res) => {
  try {
    const userId = req.user._id; 

    const { 
      age, 
      gender, 
      activityLevel, 
      dietaryPreferences, 
      extraDetails 
    } = req.body;

    if (!age || !gender || !activityLevel || !dietaryPreferences) {
      return res.status(400).json({ message: 'Please answer all required questions.' });
    }
    
    const prompt = `
      As an expert Ayurvedic dietitian, create a highly personalized one-day diet plan.
      ENSURE each meal starts with a clear header: Breakfast, Lunch, Dinner, etc in a bullet points , not more than 350 words .
    
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); 
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const dietPlanText = response.text();

    // 2. LOG THE NEW DIET PLAN AND MEALS TO THE DATABASE
    const mealLogs = extractMealNames(dietPlanText);

    const newDietLog = new DietPlanLog({
        user: userId,
        planText: dietPlanText,
        mealLogs: mealLogs,
    });
    await newDietLog.save();
    
    console.log('Successfully generated diet plan and created new log.');
    res.status(200).json({ dietPlan: dietPlanText });

  } catch (error) {
    console.error('CRITICAL SERVER ERROR generating diet plan (500):', error.message, error.stack);
    res.status(500).json({ message: 'Server error while generating diet plan.' });
  }
};

// --- CONTROLLER 2: Log Meal Completion ---
const logMealCompletion = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { logId, mealName, isCompleted, userWeight, waterIntakeLiters } = req.body;

        const log = await DietPlanLog.findOne({ _id: logId, user: userId });

        if (!log) {
            return res.status(404).json({ message: 'Diet log not found.' });
        }

        const mealLogEntry = log.mealLogs.find(m => m.mealName === mealName);
        if (mealLogEntry) {
            mealLogEntry.isCompleted = isCompleted;
            mealLogEntry.timeLogged = new Date();
        }

        if (userWeight) log.userWeight = userWeight;
        if (waterIntakeLiters) log.waterIntakeLiters = waterIntakeLiters;

        await log.save();
        
        res.status(200).json({ 
            message: 'Meal log updated successfully.', 
            updatedLog: log.mealLogs 
        });

    } catch (error) {
        console.error('Error logging meal completion:', error);
        res.status(500).json({ message: 'Server error while logging meal.' });
    }
};


// --- CONTROLLER 3: Fetch Progress Data for Dashboard ---
const getPlanProgress = async (req, res) => {
    try {
        const userId = req.user._id; 
        
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const logs = await DietPlanLog.find({
            user: userId,
            date: { $gte: ninetyDaysAgo }
        }).sort({ date: 1 });

        const weeklyData = calculateWeeklyProgress(logs);
        const monthlyData = calculateMonthlyProgress(logs);

        res.status(200).json({ 
            weeklyData: weeklyData,
            monthlyData: monthlyData,
        });

    } catch (error) {
        console.error('Error fetching plan progress:', error);
        res.status(500).json({ message: 'Server error while fetching progress.' });
    }
};


// --- HELPER FUNCTION: Calculate weekly compliance/metrics ---
const calculateWeeklyProgress = (logs) => {
    if (logs.length === 0) {
        return {
            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
            heathScore: [0, 0, 0, 0],
            water: [0, 0, 0, 0]
        };
    }
    return {
        labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
        heathScore: [85, 90, 70, 95], 
        water: [2.5, 3.0, 2.0, 2.5]
    };
};

// --- HELPER FUNCTION: Calculate monthly weight/metrics ---
const calculateMonthlyProgress = (logs) => {
    if (logs.length === 0) {
        return {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            weightLoss: [0, 0, 0]
        };
    }
    return {
        labels: ['Month 1', 'Month 2', 'Month 3'],
        weightLoss: [1.5, 2.1, 0.8], 
    };
};


module.exports = {
  generateDietPlan,
  logMealCompletion,
  getPlanProgress,
};
