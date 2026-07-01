const express = require("express");

const router = express.Router();

const {

    getReport

} = require("../controllers/reportsController");

const {

    protect

} = require("../middleware/authMiddleware");

router.get("/", protect, getReport);

module.exports = router;