const express = require("express");

const router = express.Router();

const {
    createWork,
    getCustomerWorks,
    getSingleWork,
    updateWork,
    updateWorkStatus,
    deleteWork
} = require("../controllers/workController");


const { getWorkLedger } = require("../controllers/ledgerController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createWork);

// Get all works of one customer
router.get("/customer/:customerId", protect, getCustomerWorks);

// Get ledger of one work
router.get("/ledger/:workId", protect, getWorkLedger);
router.put(
    "/status/:id",
    protect,
    updateWorkStatus
);
router.get("/:id", protect, getSingleWork);

router.put("/:id", protect, updateWork);

router.delete(
    "/:id",
    protect,
    deleteWork
);

module.exports = router;