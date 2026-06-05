// middlewares/validateSavings.js
exports.validateSavingsInput = (req, res, next) => {
    const { amount, goalName } = req.body;

    // Check if fields exist and are valid
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Please provide a valid positive amount." });
    }

    if (!goalName) {
        return res.status(400).json({ message: "Goal name is required." });
    }

    // If valid, proceed to the controller
    next();
};