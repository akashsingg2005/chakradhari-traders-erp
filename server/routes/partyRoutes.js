const express = require("express");

const router = express.Router();

const {

    createParty,

    getParties,

    getParty,

    updateParty,

    deleteParty

} = require("../controllers/partyController");
const { protect } = require("../middleware/authMiddleware");


// ======================================
// Customer Routes
// ======================================

// Create Customer
router.post("/", protect, createParty);

// Get All Customers
router.get("/", protect, getParties);

// Get Single Customer
router.get("/:id", protect, getParty);

// Update Customer
router.put("/:id", protect, updateParty);

// Delete Customer
router.delete("/:id", protect, deleteParty);

module.exports = router;