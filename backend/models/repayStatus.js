const mongoose = require("mongoose");

const repatStatusSchema = new mongoose.Schema({
  idtrip: {
    type: String,
    required: true,
  },
  tripName: {
    type: String,
    required: true,
  },
  details: [
    {
      name: {
        type: String,
        required: true,
      },
      paidUser: {
        type: String,
        required: true,
      },
      paidAmount: {
        type: Number,
        required: true,
      },
      Status: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("status", statusSchema);
