// /routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { createTransaction, getIncomeSummary } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware'); 



router.route('/income')
  .get(protect, createTransaction);

router.route('/income-summary')
  .get(protect, getIncomeSummary);

module.exports = router;