const mongoose = require('mongoose');

const creditsSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    projectName: {
        type: "string",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        default: "Active",
    },
   },
   {timestamps: true}
);

module.exports = mongoose.model("credits", creditsSchema);