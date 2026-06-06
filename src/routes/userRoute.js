const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { updateSettings } = require('../controllers/userController');

// PATCH /api/user/settings
router.patch('/settings', protect, updateSettings);

module.exports = router;