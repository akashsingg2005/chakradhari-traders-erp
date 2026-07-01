const Business = require("../models/Business");
const Party = require("../models/Party");
const Work = require("../models/Work");
const OrderItem = require("../models/OrderItem");

exports.getInvoice = async (req, res) => {

    try {

        const work = await Work.findOne({

            _id: req.params.workId,

            owner: req.user._id

        })
        .populate("customer")
        .populate("business");

        if (!work) {

            return res.status(404).json({

                success: false,

                message: "Work not found"

            });

        }

        const items = await OrderItem.find({

            work: work._id

        });

        res.json({

            success: true,

            business: work.business,

            customer: work.customer,

            work,

            items

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};