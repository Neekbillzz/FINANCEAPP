const mongoose = require("mongoose");

const {
  Transaction,
  Budget,
  Notification,
} = require("../models/FinancialModel");

exports.createTransaction = async (req, res) => {
  console.log(req.body);
  try {
    const { type, source, category, amount, description, account, status } =
      req.body;
    const userId = req.user.id;

    if (!type || !category || !amount || !description || !account) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      category,
      description,
      account,
      amount,
      status: status || "Cleared",
    });

    if (type === "expense") {
      const budget = await Budget.findOne({ userId, category });

      if (budget) {
        budget.currentSpend += Number(amount);
        await budget.save();

        if (budget.currentSpend > budget.limitAmount) {
          await Notification.create({
            userId,
            type: "Critical",
            title: "Budget Exceeded",
            message: `Your "${category}" budget has exceeded its monthly limit by $${budget.currentSpend - budget.limitAmount}.`,
          });
        }
      }
    }

    res.status(201).json({ data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getIncomeSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const revenueMix = await Transaction.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId), type: "income" },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome = revenueMix.reduce(
      (sum, item) => sum + item.totalAmount,
      0,
    );
    const formattedMix = revenueMix.map((item) => ({
      category: item._id,
      amount: item.totalAmount,
      percentage:
        totalIncome > 0
          ? ((item.totalAmount / totalIncome) * 100).toFixed(0)
          : 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        revenueMix: formattedMix,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const logExpense = async (req, res) => {
  const { amount, category } = req.body;
  const userId = req.user.id;

  const newTransaction = await Transaction.create({ ...req.body, userId });

  if (req.body.type === "expense") {
    const budget = await Budget.findOne({ userId, category });

    if (budget) {
      budget.currentSpend += amount;
      await budget.save();

      if (budget.currentSpend > budget.limitAmount) {
        await Notification.create({
          userId,
          type: "Critical",
          title: "Budget Exceeded",
          message: `Your "${category}" budget has exceeded its monthly limit.`,
        });
      }
    }
  }

  res.status(201).json({ success: true, data: newTransaction });
};
