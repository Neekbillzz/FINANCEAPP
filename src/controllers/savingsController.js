const { SavingsGoal } = require('../models/FinancialModel');

// @desc    Create a new target saving goal
exports.createGoal = async (req, res) => {
  try {
    const { name, title, targetAmount, targetDate } = req.body;
    const newGoal = new SavingsGoal({
      user: req.user.id,
      name,
      title,
      targetAmount,
      targetDate,
      currentAmount: 0,
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all goals for the logged-in user
exports.getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user.id });
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add funds to an existing savings goal
exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Find the specific goal by ID and verify it belongs to the user
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });

    if (!goal) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    // Update currentAmount by adding the new funds
    goal.currentAmount += Number(amount);
    await goal.save();

    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};