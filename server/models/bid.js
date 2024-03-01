const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema(
  {
    sellCredits: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sell_creditforms",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
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