const { request } = require("express");
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  account: { type: String },
  date: { type: Date, default: Date.now },
});

const ExpenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  date: { type: Date, request: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  account: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SavingsGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  category: {
    type: String,
    enum: [
      "emergency_fund",
      "vacation",
      "house",
      "car",
      "education",
      "wedding",
      "retirement",
      "investment",
      "gadget",
      "medical",
      "other",
    ],
    default: "other",
  },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  estimatedCompletionDate: { type: Date },
});

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true }, // e.g., "Software"
  limitAmount: { type: Number, required: true },
  currentSpend: { type: Number, default: 0 },
});

module.exports = {
  Transaction: mongoose.model("Transaction", TransactionSchema),
  SavingsGoal: mongoose.model("SavingsGoal", SavingsGoalSchema),
  Budget: mongoose.model("Budget", BudgetSchema),
  Expense: mongoose.model("Expense", ExpenseSchema),
};
