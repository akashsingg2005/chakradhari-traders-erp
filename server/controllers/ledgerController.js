const Work = require("../models/Work");

exports.getWorkLedger = async (req, res) => {

    try {

        const work = await Work.findById(req.params.workId);

        if (!work) {

            return res.status(404).json({

                success: false,

                message: "Work not found"

            });

        }

        res.json({

            success: true,

            data: work

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};