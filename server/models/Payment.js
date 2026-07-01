const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Party",
        required: true
    },

    work: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentType: {
        type: String,
        enum: [
            "Received",
            "Expense"
        ],
        default: "Received"
    },

    paymentMethod: {
        type: String,
        enum: [
            "Cash",
            "UPI",
            "Bank"
        ],
        default: "Cash"
    },

    referenceNo: {
        type: String,
        default: ""
    },

    notes: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model("Payment", paymentSchema);