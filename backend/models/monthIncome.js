const mongoose = require("mongoose");

const monthIncomeSchema = new mongoose.Schema({
  monthIncome: {
    type: Number,
    required: true,
    minlength: 1,
    trim: true,
  },
  savings: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
});

module.exports = mongoose.model("monthIncome", monthIncomeSchema);
