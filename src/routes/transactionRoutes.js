// /routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { createTransaction, getIncomeSummary, getAllTransactions } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware'); 



router.route('/')
  .get(protect, getAllTransactions)   // GET  /transactions
  .post(protect, createTransaction);  // POST /transactions

router.route('/income-summary')
  .get(protect, getIncomeSummary);

module.exports = router;


