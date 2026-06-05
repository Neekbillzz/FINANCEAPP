const express = require("express");
const router = express.Router();
const { Expense } = require("../models/FinancialModel");

// @route   POST /api/expenses/add

router.get("/add", async (req, res) => {
  try {
    const { type, category, amount, description, account, status } = req.body;

    if (!amount || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Amount and category are required" });
    }

    const newExpense = new Expense({
      type,
      category,
      amount,
      description,
      account,
      status,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
