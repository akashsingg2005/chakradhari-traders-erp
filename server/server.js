require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

const app = express();

const authRoutes = require("./routes/authRoutes");

const businessRoutes = require("./routes/businessRoutes");

const partyRoutes = require("./routes/partyRoutes");

const workRoutes = require("./routes/workRoutes");

const paymentRoutes =
require("./routes/paymentRoutes");
const dashboardRoutes =
require("./routes/dashboardRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const reportRoutes = require("./routes/reportRoutes");

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/party", partyRoutes);
app.use("/api/v1/work", workRoutes);

app.use(
"/api/v1/payment",
paymentRoutes
);
app.use(

    "/api/v1/dashboard",

    dashboardRoutes

);
app.use("/api/v1/invoice", invoiceRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/report", reportRoutes);

app.use(morgan("dev"));

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 Chakradhari Traders ERP API Running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
