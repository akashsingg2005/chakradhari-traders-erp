const Payment = require("../models/Payment");
const Business = require("../models/Business");
const Party = require("../models/Party");

exports.getReceipt = async (req, res) => {

    try{

        const payment = await Payment.findOne({

            _id:req.params.id,

            owner:req.user._id

        });

        if(!payment){

            return res.status(404).json({

                success:false,

                message:"Payment not found"

            });

        }

        const business = await Business.findById(payment.business);

        const customer = await Party.findById(payment.customer);

        res.json({

            success:true,

            business,

            customer,

            payment

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};