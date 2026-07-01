const Party = require("../models/Party");
const Work = require("../models/Work");
const Payment = require("../models/Payment");
const Expense = require("../models/Expense");

// ======================================
// Business Report
// ======================================

exports.getReport = async (req, res) => {

    try {

        const business = req.query.business;

        if (!business) {

            return res.status(400).json({

                success: false,

                message: "Business is required"

            });

        }

        // =============================
        // Customers
        // =============================

        const totalCustomers = await Party.countDocuments({

            owner: req.user._id,

            business

        });

        // =============================
        // Works
        // =============================

        const totalWorks = await Work.countDocuments({

            owner: req.user._id,

            business

        });

        const activeWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: {

                $nin: [

                    "Delivered",

                    "Closed",

                    "Cancelled"

                ]

            }

        });

        const completedWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: {

                $in: [

                    "Delivered",

                    "Closed"

                ]

            }

        });

        const cancelledWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: "Cancelled"

        });

        // =============================
        // Outstanding
        // =============================

        const works = await Work.find({

            owner: req.user._id,

            business

        });

        let outstanding = 0;

        works.forEach(work => {

            outstanding += Number(work.pendingAmount || 0);

        });

        // =============================
        // Total Income
        // =============================

        const incomePayments = await Payment.find({

            owner: req.user._id,

            business,

            paymentType: "Received"

        });

        let totalIncome = 0;

        incomePayments.forEach(payment => {

            totalIncome += Number(payment.amount || 0);

        });

        // =============================
        // Total Expense
        // =============================

        const expenses = await Expense.find({

            owner: req.user._id,

            business

        });

        let totalExpense = 0;

        expenses.forEach(expense => {

            totalExpense += Number(expense.amount || 0);

        });

        // =============================
        // Profit
        // =============================

        const profit = totalIncome - totalExpense;

        // =============================
        // Today's Income
        // =============================

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const todayPayments = await Payment.find({

            owner: req.user._id,

            business,

            paymentType: "Received",

            createdAt: {

                $gte: today

            }

        });

        let todayIncome = 0;

        todayPayments.forEach(payment => {

            todayIncome += Number(payment.amount || 0);

        });

        // =============================
        // Monthly Income
        // =============================

        const startOfMonth = new Date();

        startOfMonth.setDate(1);

        startOfMonth.setHours(0, 0, 0, 0);

        const monthPayments = await Payment.find({

            owner: req.user._id,

            business,

            paymentType: "Received",

            createdAt: {

                $gte: startOfMonth

            }

        });

        let monthlyIncome = 0;

        monthPayments.forEach(payment => {

            monthlyIncome += Number(payment.amount || 0);

        });

        // =============================
        // Monthly Expense
        // =============================

        const monthExpenses = await Expense.find({

            owner: req.user._id,

            business,

            createdAt: {

                $gte: startOfMonth

            }

        });

        let monthlyExpense = 0;

        monthExpenses.forEach(expense => {

            monthlyExpense += Number(expense.amount || 0);

        });

        // =============================
        // Work Status Counts
        // =============================

        const draftWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: "Draft"

        });

        const confirmedWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: "Order Confirmed"

        });

        const progressWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: "In Progress"

        });

        const finishingWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: "Finishing"

        });

        const readyWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: "Ready"

        });

        const deliveredWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: "Delivered"

        });

        // =============================
        // Response
        // =============================

        res.json({

            success: true,

            report: {

                totalCustomers,

                totalWorks,

                activeWorks,

                completedWorks,

                cancelledWorks,

                outstanding,

                todayIncome,

                monthlyIncome,

                monthlyExpense,

                totalIncome,

                totalExpense,

                profit,

                draftWorks,

                confirmedWorks,

                progressWorks,

                finishingWorks,

                readyWorks,

                deliveredWorks

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};