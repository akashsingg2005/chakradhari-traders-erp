const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({

    work: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work",
        required: true
    },

    itemName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    quantity: {
        type: Number,
        required: true,
        default: 1
    },

    unit: {
        type: String,
        default: "Nos"
    },

    rate: {
        type: Number,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("OrderItem", orderItemSchema);