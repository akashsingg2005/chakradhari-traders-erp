const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({

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

    workNumber: {
        type: String,
        unique: true
    },

    invoiceNumber: {
        type: String,
        unique: true,
        sparse: true
    },

    quotationNumber: {
        type: String,
        default: ""
    },

    workName: {
        type: String,
        required: true,
        trim: true
    },

    workType: {
        type: String,
        default: "General"
    },

    customerReference: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    workStatus: {
    type: String,
    enum: [
        "Draft",
        "Order Confirmed",
        "In Progress",
        "Finishing",
        "Ready",
        "Delivered",
        "Closed",
        "Cancelled"
    ],
    default: "Draft"
},

    expectedDeliveryDate: {
        type: Date
    },

    completedDate: {
        type: Date
    },

    subtotal: {
        type: Number,
        default: 0
    },

    labourCharge: {
        type: Number,
        default: 0
    },

    labourNote: {
        type: String,
        default: ""
    },

    transportCharge: {
        type: Number,
        default: 0
    },

    installationCharge: {
        type: Number,
        default: 0
    },

    otherCharge: {
        type: Number,
        default: 0
    },

    discountType: {
        type: String,
        enum: ["Fixed", "Percentage"],
        default: "Fixed"
    },

    discountValue: {
        type: Number,
        default: 0
    },

    discountAmount: {
        type: Number,
        default: 0
    },

    taxType: {
        type: String,
        enum: ["None", "GST", "CGST_SGST", "IGST"],
        default: "None"
    },

    taxPercentage: {
        type: Number,
        default: 0
    },

    taxAmount: {
        type: Number,
        default: 0
    },

    finalAmount: {
        type: Number,
        default: 0
    },

    receivedAmount: {
        type: Number,
        default: 0
    },

    pendingAmount: {
        type: Number,
        default: 0
    },

    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Partially Paid",
            "Completed"
        ],
        default: "Pending"
    },

    notes: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Work", workSchema);