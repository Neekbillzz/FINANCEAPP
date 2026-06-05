const express = require('express');
const router = express.Router();
const { getProfileSettings, updateProfileSettings } = require('../controllers/settingsController');
const { protect } = require('../middlewares/authMiddleware');


router.route('/')
  .get(protect, getProfileSettings)
  .put(protect, updateProfileSettings);

module.exports = router;