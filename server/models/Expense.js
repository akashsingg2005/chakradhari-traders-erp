const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

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

category: {
    type: String,
    required: true,
    trim: true,
    default: "Other"
},

    title: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true
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

    notes: {
        type: String,
        default: ""
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Expense", expenseSchema);
