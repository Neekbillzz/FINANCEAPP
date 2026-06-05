const { SavingsGoal } = require('../models/FinancialModel');

// Create a new target saving goal
exports.createGoal = async (req, res) => {
    try {
        const { title, targetAmount, targetDate } = req.body;
        const newGoal = new SavingsGoal({
            user: req.user.id, 
            title,
            targetAmount,
            targetDate,
            currentAmount: 0 
        });
        await newGoal.save();
        res.status(201).json(newGoal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all goals for the logged-in user
exports.getGoals = async (req, res) => {
    try {
        const goals = await Savings.find({ user: req.user.id });
        res.status(200).json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};