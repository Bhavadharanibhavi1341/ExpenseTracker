const mongoose = require("mongoose");

const splitPaySchema = new mongoose.Schema({
  splitPayName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  details: [
    {
      UserName: String,
      paid: Number,
      toPay: Number,
      toGet: Number,
    },
  ],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
});

module.exports = mongoose.model("splitpay", splitPaySchema);
