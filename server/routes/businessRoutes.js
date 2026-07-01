const express = require("express");

const router = express.Router();

const {

    createBusiness,

    getBusinesses,

    getBusiness,

    updateBusiness,

    deleteBusiness

} = require("../controllers/businessController");

const {

    protect

} = require("../middleware/authMiddleware");

// ===================================
// Create Business
// ===================================

router.post(

    "/",

    protect,

    createBusiness

);

// ===================================
// Get All Businesses
// ===================================

router.get(

    "/",

    protect,

    getBusinesses

);

// ===================================
// Get Single Business
// ===================================

router.get(

    "/:id",

    protect,

    getBusiness

);

// ===================================
// Update Business
// ===================================

router.put(

    "/:id",

    protect,

    updateBusiness

);

// ===================================
// Delete Business
// ===================================

router.delete(

    "/:id",

    protect,

    deleteBusiness

);

module.exports = router;