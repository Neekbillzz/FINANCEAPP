const mongoose = require("mongoose");
const { Transaction } = require("../models/FinancialModel");

exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const stats = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          totalBalance: [
            {
              $group: {
                _id: null,
                balance: {
                  $sum: {
                    $cond: [
                      { $eq: ["$type", "income"] },
                      "$amount",
                      { $multiply: ["$amount", -1] },
                    ],
                  },
                },
              },
            },
          ],

          monthlyMetrics: [
            { $match: { date: { $gte: startOfMonth } } },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ]);

    const balance = stats[0].totalBalance[0]?.balance || 0;
    const monthlyData = stats[0].monthlyMetrics || [];

    const monthlyIncome =
      monthlyData.find((d) => d._id === "income")?.total || 0;

    const monthlySpend =
      monthlyData.find((d) => d._id === "expense")?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        totalAvailableBalance: balance,
        monthlyIncome: monthlyIncome,
        monthlySpend: monthlySpend,
        percentageChange: 12.5,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
