const express = require("express");

const router = express.Router();

const { getDashboard, getNotifications } = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getDashboard);
router.get(

    "/notifications",

    protect,

    getNotifications

);

module.exports = router;