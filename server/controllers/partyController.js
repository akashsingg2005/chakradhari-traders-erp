const Party = require("../models/Party");
const Work = require("../models/Work");

// ======================================
// Create Customer
// ======================================

exports.createParty = async (req, res) => {

    try {

        const party = await Party.create({

            ...req.body,

            owner: req.user._id

        });

        res.status(201).json({

            success: true,

            message: "Customer Created Successfully",

            data: party

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Get All Customers
// ======================================

exports.getParties = async (req, res) => {

    try {

        const parties = await Party.find({

            owner: req.user._id,

            business: req.query.business,

            partyType: "Customer"

        }).sort({ name: 1 });

        const customers = await Promise.all(

            parties.map(async (party) => {

                const works = await Work.find({

                    owner: req.user._id,

                    business: req.query.business,

                    customer: party._id

                });

                let totalBusiness = 0;
                let received = 0;
                let outstanding = 0;

                works.forEach(work => {

                    totalBusiness += Number(work.finalAmount || 0);

                    received += Number(work.receivedAmount || 0);

                    outstanding += Number(work.pendingAmount || 0);

                });

                return {

                    ...party.toObject(),

                    totalBusiness,

                    received,

                    outstanding,

                    workCount: works.length

                };

            })

        );

        res.json({

            success: true,

            data: customers

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Get Single Customer
// ======================================

exports.getParty = async (req, res) => {

    try {

        const party = await Party.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

        if (!party) {

            return res.status(404).json({

                success: false,

                message: "Customer Not Found"

            });

        }

        const works = await Work.find({

            owner: req.user._id,

            business: party.business,

            customer: party._id

        });

        let totalBusiness = 0;
        let received = 0;
        let outstanding = 0;

        works.forEach(work => {

            totalBusiness += Number(work.finalAmount || 0);

            received += Number(work.receivedAmount || 0);

            outstanding += Number(work.pendingAmount || 0);

        });

        res.json({

            success: true,

            customer: {

                ...party.toObject(),

                totalBusiness,

                received,

                outstanding,

                workCount: works.length

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

// ======================================
// Update Customer
// ======================================

exports.updateParty = async (req, res) => {

    try {

        const party = await Party.findOneAndUpdate(

            {

                _id: req.params.id,

                owner: req.user._id

            },

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!party) {

            return res.status(404).json({

                success: false,

                message: "Customer Not Found"

            });

        }

        res.json({

            success: true,

            message: "Customer Updated Successfully",

            data: party

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Delete Customer
// ======================================

exports.deleteParty = async (req, res) => {

    try {

        const party = await Party.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

        if (!party) {

            return res.status(404).json({

                success: false,

                message: "Customer Not Found"

            });

        }

        await party.deleteOne();

        res.json({

            success: true,

            message: "Customer Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};