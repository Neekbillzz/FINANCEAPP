const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');
const { protect } = require('../middlewares/authMiddleware');
const { validateSavingsInput } = require('../middlewares/validateSavings');

console.log("Protect middleware:", protect);
console.log("GetGoals controller:", savingsController.getGoals);

router.post('/', protect, validateSavingsInput, savingsController.createGoal);
router.post('/add-funds/:id', protect, savingsController.addFunds);
router.get('/history', protect, savingsController.getGoals);

module.exports = router;