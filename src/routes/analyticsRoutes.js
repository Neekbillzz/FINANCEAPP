const express = require('express');
const router = express.Router();
const { uploadBusinessLogo } = require('../controllers/settingsController');
const { protect } = require('../middlewares/authMiddleware');
const uploadLogo = require('../middlewares/fileUpload');


router.patch('/logo', protect, uploadLogo.single('businessLogo'), uploadBusinessLogo);

module.exports = router;