const express = require("express");

const router = express.Router();

const {

register,

login,

updateProfile,

changePassword

} = require("../controllers/authController");

const {

protect

} = require("../middleware/authMiddleware");



router.post("/register", register);

router.post("/login", login);
router.put(

"/profile",

protect,

updateProfile

);

router.put(

"/password",

protect,

changePassword

);

module.exports = router;

