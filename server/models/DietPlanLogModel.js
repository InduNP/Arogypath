// server/models/DietPlanLogModel.js (Original code you had before errors)

const mongoose = require('mongoose');

const DietPlanLogSchema = new mongoose.Schema({
    // Link back to the user who owns this log
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // The specific day this plan log is for
    date: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    
    // The actual generated plan text (for display on the dashboard)
    planText: { 
        type: String, 
        required: true 
    }, 

    // An array of sub-documents to track meal completion
    mealLogs: [{
        mealName: { 
            type: String, 
            required: true // e.g., "Breakfast", "Lunch"
        }, 
        isCompleted: { 
            type: Boolean, 
            default: false // The flag for tracking completion
        }, 
        timeLogged: { 
            type: Date 
        }
    }],
    
    // Optional metrics the user can update for progress tracking
    userWeight: { 
        type: Number 
    },
    waterIntakeLiters: { 
        type: Number 
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Register the model with Mongoose
module.exports = mongoose.model('DietPlanLog', DietPlanLogSchema);