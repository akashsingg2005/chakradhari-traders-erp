const Expense = require("../models/Expense");

// ==========================
// Add Expense
// ==========================

exports.addExpense = async (req, res) => {

    try {

        const expense = await Expense.create({

            owner: req.user._id,

            business: req.body.business,

            category: req.body.category,

            title: req.body.title,

            amount: req.body.amount,

            paymentMethod: req.body.paymentMethod,

            notes: req.body.notes

        });

        res.status(201).json({

            success: true,

            message: "Expense Added Successfully",

            data: expense

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================
// Get Expenses
// ==========================

exports.getExpenses = async (req, res) => {

    try {

        const expenses = await Expense.find({

            owner: req.user._id,

            business: req.query.business

        })

        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            data: expenses

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================
// Update Expense
// ==========================

exports.updateExpense = async (req, res) => {

    try {

        const expense = await Expense.findOneAndUpdate(

            {

                _id: req.params.id,

                owner: req.user._id

            },

            {

                category: req.body.category,

                title: req.body.title,

                amount: req.body.amount,

                paymentMethod: req.body.paymentMethod,

                notes: req.body.notes

            },

            {

                new: true,

                runValidators: true

            }

        );

        if (!expense) {

            return res.status(404).json({

                success: false,

                message: "Expense not found"

            });

        }

        res.json({

            success: true,

            message: "Expense Updated Successfully",

            data: expense

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================
// Delete Expense
// ==========================

exports.deleteExpense = async (req, res) => {

    try {

        const expense = await Expense.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

        if (!expense) {

            return res.status(404).json({

                success: false,

                message: "Expense not found"

            });

        }

        await expense.deleteOne();

        res.json({

            success: true,

            message: "Expense Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};