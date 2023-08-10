const mongoose = require("mongoose");

const savingsSchema = new mongoose.Schema({
  savings: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
  month: {
    type: Number,
  },
  year: {
    type: Number,
  },
});

module.exports = mongoose.model("savings", savingsSchema);
