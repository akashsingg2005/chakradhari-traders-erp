const Work = require("../models/Work");
const OrderItem = require("../models/OrderItem");
const Business = require("../models/Business");

// ===================================
// Create Work
// ===================================

exports.createWork = async (req, res) => {

    try {

        const {

            business,

            customer,

            workName,

            workType,

            description,

            customerReference,

            priority,

            expectedDeliveryDate,

            labourCharge,

            labourNote,

            transportCharge,

            installationCharge,

            otherCharge,

            discountType,

            discountValue,

            notes,

            items

        } = req.body;

        // -----------------------------
        // Verify Business Ownership
        // -----------------------------

        const businessExists = await Business.findOne({

            _id: business,

            owner: req.user._id

        });

        if (!businessExists) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized Business"

            });

        }

        // -----------------------------
        // Validate Items
        // -----------------------------

        if (!items || items.length === 0) {

            return res.status(400).json({

                success: false,

                message: "At least one item is required."

            });

        }

        // -----------------------------
        // Material Total
        // -----------------------------

        let materialTotal = 0;

        items.forEach(item => {

            materialTotal += Number(item.quantity) * Number(item.rate);

        });

        const subtotal =

            materialTotal +

            Number(labourCharge || 0) +

            Number(transportCharge || 0) +

            Number(installationCharge || 0) +

            Number(otherCharge || 0);

        // -----------------------------
        // Discount
        // -----------------------------

        let discountAmount = 0;

        if (discountType === "Percentage") {

            discountAmount = subtotal * Number(discountValue || 0) / 100;

        }

        else {

            discountAmount = Number(discountValue || 0);

        }

        const finalAmount = subtotal - discountAmount;

        // -----------------------------
// Business-wise Work Number
// -----------------------------
// Get the highest existing work number instead of
// counting documents. This prevents number reuse
// when an old work is deleted.

const lastWork = await Work.findOne({
    owner: req.user._id,
    business
})
.sort({ workNumber: -1 })
.lean();

let nextNumber = 1;

if (lastWork && lastWork.workNumber) {

    const lastNumber = parseInt(
        lastWork.workNumber.replace("WK", ""),
        10
    );

    if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
    }

}

const workNumber =
    "WK" +
    String(nextNumber).padStart(5, "0");

        // -----------------------------
// Generate & Create Work Safely
// -----------------------------

let work;

for (let attempt = 0; attempt < 5; attempt++) {

    try {

        const lastWork = await Work.findOne({

            owner: req.user._id,

            business

        })
        .sort({

            workNumber: -1

        })
        .lean();

        let nextNumber = 1;

        if (lastWork && lastWork.workNumber) {

            const lastNumber = parseInt(

                lastWork.workNumber.replace("WK", ""),

                10

            );

            if (!isNaN(lastNumber)) {

                nextNumber = lastNumber + 1;

            }

        }

        const workNumber =

            "WK" +

            String(nextNumber).padStart(5, "0");

        work = await Work.create({

            owner: req.user._id,

            business,

            customer,

            workNumber,

            workName,

            workType,

            description,

            customerReference,

            subtotal,

            labourCharge,

            labourNote,

            transportCharge,

            installationCharge,

            otherCharge,

            priority,

            expectedDeliveryDate,

            discountType,

            discountValue,

            discountAmount,

            finalAmount,

            receivedAmount: 0,

            pendingAmount: finalAmount,

            paymentStatus: "Pending",

            workStatus: "Draft",

            statusUpdatedAt: new Date(),

            notes

        });

        // Successfully created

        break;

    }

    catch (error) {

        // Duplicate work number caused by
        // simultaneous Save requests.
        // Try generating the next number again.

        if (

            error.code === 11000 &&

            error.keyPattern &&

            error.keyPattern.business &&

            error.keyPattern.workNumber

        ) {

            if (attempt === 4) {

                throw new Error(

                    "Unable to generate a unique work number. Please try again."

                );

            }

            continue;

        }

        throw error;

    }

}
        // -----------------------------
        // Save Items
        // -----------------------------

        const savedItems = [];

        for (const item of items) {

            const newItem = await OrderItem.create({

                work: work._id,

                itemName: item.itemName,

                description: item.description || "",

                quantity: item.quantity,

                unit: item.unit || "Nos",

                rate: item.rate,

                amount: Number(item.quantity) * Number(item.rate)

            });

            savedItems.push(newItem);

        }

        res.status(201).json({

            success: true,

            message: "Work Created Successfully",

            work,

            items: savedItems

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
// Get Customer Works
// ===================================

exports.getCustomerWorks = async (req, res) => {

    try {

        const works = await Work.find({

            owner: req.user._id,

            customer: req.params.customerId

        })

        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            data: works

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
// Get Single Work
// ===================================

exports.getSingleWork = async (req, res) => {

    try {

        const work = await Work.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

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


// ===================================
// Update Work
// ===================================

exports.updateWork = async (req, res) => {

    try {

        const work = await Work.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

        if (!work) {

            return res.status(404).json({

                success: false,

                message: "Work not found"

            });

        }

        const {

            workName,

            workType,

            customerReference,

            description,

            priority,

            expectedDeliveryDate,

            labourCharge,

            labourNote,

            transportCharge,

            installationCharge,

            otherCharge,

            discountType,

            discountValue,

            notes,

            items

        } = req.body;

        // ==========================
        // Calculate Material Total
        // ==========================

        let materialTotal = 0;

        items.forEach(item => {

            materialTotal +=
                Number(item.quantity) *
                Number(item.rate);

        });

        // ==========================
        // Calculate Subtotal
        // ==========================

        const subtotal =

            materialTotal +

            Number(labourCharge || 0) +

            Number(transportCharge || 0) +

            Number(installationCharge || 0) +

            Number(otherCharge || 0);

        // ==========================
        // Calculate Discount
        // ==========================

        let discountAmount = 0;

        if (discountType === "Percentage") {

            discountAmount =

                subtotal *

                Number(discountValue || 0) /

                100;

        }

        else {

            discountAmount =

                Number(discountValue || 0);

        }

        // ==========================
        // Final Amount
        // ==========================

        const finalAmount =

            subtotal - discountAmount;

        // ==========================
        // Update Work
        // ==========================

        work.workName = workName;

        work.workType = workType;

        work.customerReference = customerReference;

        work.description = description;

        work.priority = priority;

        work.expectedDeliveryDate = expectedDeliveryDate;

        work.labourCharge = Number(labourCharge || 0);

        work.labourNote = labourNote;

        work.transportCharge = Number(transportCharge || 0);

        work.installationCharge = Number(installationCharge || 0);

        work.otherCharge = Number(otherCharge || 0);

        work.discountType = discountType;

        work.discountValue = Number(discountValue || 0);

        work.discountAmount = discountAmount;

        work.subtotal = subtotal;

        work.finalAmount = finalAmount;

        work.pendingAmount =

            finalAmount - work.receivedAmount;

        work.notes = notes;

        await work.save();

        // ==========================
        // Delete Old Items
        // ==========================

        await OrderItem.deleteMany({

            work: work._id

        });

        // ==========================
        // Save New Items
        // ==========================

        if (items && items.length > 0) {

            for (const item of items) {

                await OrderItem.create({

                    work: work._id,

                    itemName: item.itemName,

                    description: item.description || "",

                    quantity: Number(item.quantity),

                    unit: item.unit || "Nos",

                    rate: Number(item.rate),

                    amount:

                        Number(item.quantity) *

                        Number(item.rate)

                });

            }

        }

        res.json({

            success: true,

            message: "Work Updated Successfully",

            work

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
// Delete Work
// ===================================

exports.deleteWork = async (req, res) => {

    try {

        const work = await Work.findOne({

            _id: req.params.id,

            owner: req.user._id

        });

        if (!work) {

            return res.status(404).json({

                success: false,

                message: "Work not found"

            });

        }

        await OrderItem.deleteMany({

            work: work._id

        });

        await work.deleteOne();

        res.json({

            success: true,

            message: "Work Deleted Successfully"

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
// Update Work Status
// ===================================

exports.updateWorkStatus = async (req,res)=>{

    try{

        const updateData = {

            workStatus: req.body.workStatus,

            statusUpdatedAt: new Date()

        };

        if(["Closed", "Delivered", "Completed"].includes(req.body.workStatus)){

            updateData.completedDate = new Date();

        }

        const work = await Work.findOneAndUpdate(

            {

                _id:req.params.id,

                owner:req.user._id

            },

            updateData,

            {

                new:true

            }

        );

        if(!work){

            return res.status(404).json({

                success:false,

                message:"Work not found"

            });

        }

        res.json({

            success:true,

            message:"Status Updated",

            data:work

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};
