const Business = require("../models/Business");

// ===================================
// Create Business
// ===================================

exports.createBusiness = async (req, res) => {

    try {

        const {

            businessName,

            ownerName,

            mobile,

            email,

            gstNumber,

            address,

            businessType

        } = req.body;

        const business = await Business.create({

            owner: req.user._id,

            businessName,

            ownerName,

            mobile,

            email,

            gstNumber,

            address,

            businessType

        });

        res.status(201).json({

            success: true,

            message: "Business Created Successfully",

            data: business

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
// Get All Businesses
// ===================================

exports.getBusinesses = async (req, res) => {

    try {

        const businesses = await Business.find({

            owner: req.user._id

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            data: businesses

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
// Get Single Business
// ===================================

exports.getBusiness = async (req, res) => {

    try {

        const business = await Business.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

        if (!business) {

            return res.status(404).json({

                success: false,

                message: "Business not found"

            });

        }

        res.json({

            success: true,

            data: business

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
// Update Business
// ===================================

exports.updateBusiness = async (req, res) => {

    try {

        const business = await Business.findOneAndUpdate(

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

        if (!business) {

            return res.status(404).json({

                success: false,

                message: "Business not found"

            });

        }

        res.json({

            success: true,

            message: "Business Updated Successfully",

            data: business

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
// Delete Business
// ===================================

exports.deleteBusiness = async (req, res) => {

    try {

        const business = await Business.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

        if (!business) {

            return res.status(404).json({

                success: false,

                message: "Business not found"

            });

        }

        await business.deleteOne();

        res.json({

            success: true,

            message: "Business Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};