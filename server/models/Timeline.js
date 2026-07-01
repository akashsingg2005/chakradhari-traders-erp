const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({

    work: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work",
        required: true
    },

    action: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Timeline", timelineSchema);