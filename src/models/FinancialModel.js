const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  account: { type: String },
  date: { type: Date, default: Date.now },
});

const SavingsGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  estimatedCompletionDate: { type: Date },
});

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true }, // e.g., "Software"
  limitAmount: { type: Number, required: true },
  currentSpend: { type: Number, default: 0 },
});

module.exports = {
  Transaction: mongoose.model("Transaction", TransactionSchema),
  SavingsGoal: mongoose.model("SavingsGoal", SavingsGoalSchema),
  Budget: mongoose.model("Budget", BudgetSchema),
};
