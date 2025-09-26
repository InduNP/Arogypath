// server/services/dietPlanService.js

const mongoose = require('mongoose');

// --- 1. DEFINE AND REGISTER THE SCHEMA IF IT DOESN'T EXIST ---
// This ensures no MissingSchemaError or RedefinitionError occurs.
const DietPlanLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    planText: { type: String, required: true }, 
    mealLogs: [{
        mealName: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
        timeLogged: { type: Date }
    }],
    userWeight: { type: Number },
    waterIntakeLiters: { type: Number }
}, { timestamps: true });

// Use mongoose.models to check if the model is already defined
const DietPlanLog = mongoose.models.DietPlanLog || mongoose.model('DietPlanLog', DietPlanLogSchema);

// --- EXPORT THE MODEL AND THE HELPER FUNCTIONS ---
module.exports = {
    DietPlanLog,
    // Note: You will need to move your helper functions (calculateWeeklyProgress etc.) here too, 
    // or keep them in the controller. For simplicity, we only export the model here.
};