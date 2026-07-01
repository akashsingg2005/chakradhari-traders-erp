const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({

    work: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work",
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    fileType: {
        type: String,
        enum: [
            "Image",
            "PDF",
            "CDR",
            "AI",
            "Other"
        ],
        default: "Image"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Attachment", attachmentSchema);