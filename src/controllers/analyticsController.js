const mongoose = require("mongoose");
const { Transaction } = require("../models/FinancialModel");

exports.getMonthlyChartData = async (req, res) => {
  try {
    const userId = req.user.id;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const chartData = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: sixMonthsAgo },
        },
      },

      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          totalAmount: { $sum: "$amount" },
        },
      },

      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const monthsNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const formattedData = chartData.reduce((acc, item) => {
      const monthLabel = monthsNames[item._id.month - 1];

      let monthEntry = acc.find((m) => m.month === monthLabel);
      if (!monthEntry) {
        monthEntry = { month: monthLabel, income: 0, spend: 0, netSavings: 0 };
        acc.push(monthEntry);
      }

      if (item._id.type === "income") monthEntry.income = item.totalAmount;
      if (item._id.type === "expense") monthEntry.spend = item.totalAmount;

      monthEntry.netSavings = monthEntry.income - monthEntry.spend;

      return acc;
    }, []);

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
