const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema(
  {
    sellCredits: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sellCreditForm",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellCreditForm",
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bids", bidSchema);