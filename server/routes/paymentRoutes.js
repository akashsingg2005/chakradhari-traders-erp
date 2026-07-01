const express = require("express");

const router = express.Router();

const {

    addPayment,

    getPayments,

    getAllPayments,

    deletePayment

} = require("../controllers/paymentController");

const {

    protect

} = require("../middleware/authMiddleware");

const { getReceipt } = require("../controllers/paymentReceiptController");

router.post("/", protect, addPayment);
router.get("/receipt/:id", protect, getReceipt);
router.get("/all", protect, getAllPayments);

router.get("/:workId", protect, getPayments);

router.delete("/:id", protect, deletePayment);

module.exports = router;