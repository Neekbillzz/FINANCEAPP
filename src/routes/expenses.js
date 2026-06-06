const express = require("express");
const router = express.Router();
const { Expense } = require("../models/FinancialModel");
const { protect } = require("../middlewares/authMiddleware");

// @route   POST /api/expenses/add

router.post("/add", protect, async (req, res) => {
  try {
    const { type, category, amount, description, account, date, status } = req.body;

    if (!amount || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Amount and category are required" });
    }

    const newExpense = new Expense({
      user: req.user.id,
      type,
      category,
      amount,
      description,
      account,
      date,
      status,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", protect, async (req, res) => {
  try {

    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
