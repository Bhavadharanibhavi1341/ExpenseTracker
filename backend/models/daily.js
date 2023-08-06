const mongoose = require("mongoose");

const dailyExpenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
});

module.exports = mongoose.model("dailyExpense", dailyExpenseSchema);
