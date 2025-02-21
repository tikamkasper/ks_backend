const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const { CORS_ORIGIN } = require("./config");
const { globalErrorHandler } = require("./middlewares/globalErrorHandler.js");

// Create app
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
const customerRoutes = require("./routes/customer/customerRoutes.js");

//Routes declaration
app.use("/api/v1/customer/", customerRoutes);
// http://localhost:8000/api/v1/customer/signup/send_otp

//Global error handler
app.use(globalErrorHandler);

// Export app
module.exports = { app };
