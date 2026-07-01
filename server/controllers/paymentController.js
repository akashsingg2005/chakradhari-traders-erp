const Payment = require("../models/Payment");
const Work = require("../models/Work");

// ===================================
// Add Payment
// ===================================

exports.addPayment = async (req, res) => {

    try {

        const work = await Work.findOne({

            _id: req.body.work,

            owner: req.user._id

        });

        if (!work) {

            return res.status(404).json({

                success: false,

                message: "Work not found"

            });

        }

        const payment = await Payment.create({

            ...req.body,

            owner: req.user._id

        });

        work.receivedAmount += Number(req.body.amount);

        work.pendingAmount = work.finalAmount - work.receivedAmount;

        if (work.pendingAmount <= 0) {

            work.pendingAmount = 0;

            work.paymentStatus = "Completed";

        }

        else if (work.receivedAmount > 0) {

            work.paymentStatus = "Partially Paid";

        }

        await work.save();

        res.status(201).json({

            success: true,

            message: "Payment Added Successfully",

            payment

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ===================================
// Get Payments
// ===================================

exports.getPayments = async (req, res) => {

    try {

        const work = await Work.findOne({

            _id: req.params.workId,

            owner: req.user._id

        });

        if (!work) {

            return res.status(404).json({

                success: false,

                message: "Work not found"

            });

        }

        const payments = await Payment.find({

            owner: req.user._id,

            work: req.params.workId

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            data: payments

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ===================================
// Delete Payment
// ===================================

exports.deletePayment = async (req, res) => {

    try {

        const payment = await Payment.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found"

            });

        }

        const work = await Work.findOne({

            _id: payment.work,

            owner: req.user._id

        });

        if (work) {

            work.receivedAmount -= Number(payment.amount);

            if (work.receivedAmount < 0) {

                work.receivedAmount = 0;

            }

            work.pendingAmount =

                work.finalAmount - work.receivedAmount;

            if (work.receivedAmount === 0) {

                work.paymentStatus = "Pending";

            }

            else if (work.pendingAmount > 0) {

                work.paymentStatus = "Partially Paid";

            }

            else {

                work.paymentStatus = "Completed";

            }

            await work.save();

        }

        await payment.deleteOne();

        res.json({

            success: true,

            message: "Payment Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ===================================
// Get All Payments
// ===================================

exports.getAllPayments = async (req, res) => {

    try {

        const payments = await Payment.find({

            owner: req.user._id,

            business: req.query.business

        })

        .populate("customer", "name")

        .populate("work", "workName")

        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            data: payments

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};