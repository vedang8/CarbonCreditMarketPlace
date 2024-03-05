const mongoose = require('mongoose');

const creditFormSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true,
        },
        projectType: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        baselineEmissionAmount: {
            type: Number,
            required: true,
        },
        projectEmissionAmount: {
            type: Number,
            required: true,
        },
        numOfTrees: {
            type: Number,
            required: true,
        },
        numOfSolarPanels: {
            type: Number,
            required: true,
        },
        electricity: {
            type: Number,
            required: true,
        },
        images: {
            type: Array,
            default: [],
            
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        status:{
            type: String,
            default: "Pending",
            required: true,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("genform", creditFormSchema)