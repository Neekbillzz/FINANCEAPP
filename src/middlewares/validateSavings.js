// middlewares/validateSavings.js
exports.validateSavingsInput = (req, res, next) => {
  const { name, category, targetAmount } = req.body;

  // Check if fields exist and are valid
  if (!name || !category || !targetAmount) {
    return res
      .status(400)
      .json({
        message: "All fields (name, category, targetAmount) are required",
      });
  }

//   if (!targetAmount || typeof targetAmount !== "number" || targetAmount <= 0) {
//     return res
//       .status(400)
//       .json({ message: "Please provide a valid positive amount." });
//   }

  // if (!goalName) {
  //     return res.status(400).json({ message: "Goal name is required." });
  // }

  // If valid, proceed to the controller
  next();
};
