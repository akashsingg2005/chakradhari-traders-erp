const Party = require("../models/Party");
const Work = require("../models/Work");
const Payment = require("../models/Payment");
const Expense = require("../models/Expense");

exports.getDashboard = async (req, res) => {

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

        const customers = await Party.countDocuments({

            owner: req.user._id,

            business

        });

        // =============================
        // Active Works
        // =============================

        const activeWorks = await Work.countDocuments({

            owner: req.user._id,

            business,

            workStatus: {

                $nin: ["Delivered","Closed", "Cancelled"]

            }

        });

        // =============================
        // Outstanding
        // =============================

        const workList = await Work.find({

            owner: req.user._id,

            business

        });

        let outstanding = 0;

        workList.forEach(work => {

            outstanding += Number(work.pendingAmount || 0);

        });

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

            todayIncome += Number(payment.amount);

        });

        const expenses = await Expense.find({

    owner: req.user._id,

    business

});

let totalExpense = 0;

expenses.forEach(expense=>{

    totalExpense += Number(expense.amount || 0);

});


// =============================
// Monthly Income
// =============================

const startOfMonth = new Date();

startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const monthlyPayments = await Payment.find({

    owner: req.user._id,

    business,

    paymentType: "Received",

    createdAt: {
        $gte: startOfMonth
    }

});

let monthlyIncome = 0;

monthlyPayments.forEach(payment => {

    monthlyIncome += Number(payment.amount || 0);

});


// =============================
// Monthly Expense
// =============================

const monthlyExpenses = await Expense.find({

    owner: req.user._id,

    business,

    createdAt: {
        $gte: startOfMonth
    }

});

let monthlyExpense = 0;

monthlyExpenses.forEach(expense => {

    monthlyExpense += Number(expense.amount || 0);

});

// =============================
// Total Income
// =============================

const allIncome = await Payment.find({

    owner: req.user._id,

    business,

    paymentType: "Received"

});

let totalIncome = 0;

allIncome.forEach(payment => {

    totalIncome += Number(payment.amount || 0);

});

// =============================
// Profit / Loss
// =============================

const profit = totalIncome - totalExpense;

        // =============================
        // Recent Payments
        // =============================

        const recentPayments = await Payment.find({

            owner: req.user._id,

            business,

            paymentType: "Received"

        })

        .populate("customer", "name")

        .sort({

            createdAt: -1

        })

        .limit(3);

        // =============================
        // Pending Works
        // =============================

        const pendingWorks = await Work.find({

    owner: req.user._id,

    business,

    pendingAmount: {

        $gt: 0

    },

    workStatus: {

    $nin: [

        "Delivered",

        "Closed",

        "Cancelled"

    ]

}

})

        .populate("customer", "name")

        .sort({

            createdAt: -1

        })

        .limit(5);

        // =============================
        // Monthly Revenue
        // =============================

        const startOfYear = new Date(

            new Date().getFullYear(),

            0,

            1

        );

        const yearPayments = await Payment.find({

            owner: req.user._id,

            business,

            paymentType: "Received",

            createdAt: {

                $gte: startOfYear

            }

        });

        const monthlyRevenue = new Array(12).fill(0);

        yearPayments.forEach(payment => {

            const month =

                new Date(payment.createdAt).getMonth();

            monthlyRevenue[month] += Number(payment.amount);

        });

        // =============================
        // Response
        // =============================

        res.json({

            success: true,

            summary: {

    customers,

    activeWorks,

    outstanding,

    todayIncome,

    monthlyIncome,

    monthlyExpense,

    totalIncome,

    totalExpense,

    profit

},

            recentPayments,

            pendingWorks,

            monthlyRevenue

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
// Dashboard Notifications
// ===================================



exports.getNotifications = async (req, res) => {

    try{

        const business = req.query.business;

        const notifications = [];

        // Latest Customers
        const customers = await Party.find({

            owner:req.user._id,

            business

        })

        .sort({createdAt:-1})

        .limit(3);

        customers.forEach(customer=>{

            notifications.push({

    icon:"fa-user-plus",

    title:"Customer Added",

    message:customer.name,

    time:customer.createdAt

});

        });

        // Latest Expenses
        const expenses = await Expense.find({

            owner:req.user._id,

            business

        })

        .sort({createdAt:-1})

        .limit(3);

        expenses.forEach(expense=>{

            notifications.push({

    icon:"fa-wallet",

    title:"Expense",

    message:`₹${expense.amount} • ${expense.title}`,

    time:expense.createdAt

});

        });

        // Latest Payments
        const payments = await Payment.find({

            owner:req.user._id,

            business

        })

        .sort({createdAt:-1})

        .limit(3);

        payments.forEach(payment=>{

            notifications.push({

    icon:"fa-money-bill-wave",

    title:"Payment",

    message:`₹${payment.amount}`,

    time:payment.createdAt

});

        });

        // Pending Works
        const works = await Work.find({

            owner:req.user._id,

            business,

            workStatus:{

                $ne:"Delivered"

            }

        })

        .limit(3);

        works.forEach(work=>{

            notifications.push({

    icon:"fa-briefcase",

    title:"Pending Work",

    message:work.workName,

    time:work.createdAt

});

        });

        res.json({

            success:true,

            data:notifications

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};