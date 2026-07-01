const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==============================
// Register Owner
// ==============================

exports.register = async (req, res) => {
    try {

        const ownerCount = await User.countDocuments();

        if (ownerCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Owner account already exists. Registration is disabled."
            });
        }

        const { fullName, email, phone, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const owner = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Owner Registered Successfully",
            owner
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==============================
// Login

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check Email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Create JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.updateProfile = async (req, res) => {

    try {

        const { fullName, email, phone } = req.body;

        const user = await User.findByIdAndUpdate(

            req.user._id,

            {

                fullName,

                email,

                phone

            },

            {

                new: true

            }

        );

        res.json({

            success: true,

            message: "Profile Updated Successfully",

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.changePassword = async (req, res) => {

    try {

        const {

            currentPassword,

            newPassword

        } = req.body;

        const user = await User.findById(req.user._id);

        const match = await bcrypt.compare(

            currentPassword,

            user.password

        );

        if (!match) {

            return res.status(400).json({

                success: false,

                message: "Current Password is incorrect."

            });

        }

        user.password = await bcrypt.hash(

            newPassword,

            10

        );

        await user.save();

        res.json({

            success: true,

            message: "Password Updated Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

