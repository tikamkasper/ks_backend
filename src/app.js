const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { CORS_ORIGIN } = require("./config");

const app = express();

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import

const registerRoutes = require("./routes/user/registerRoutes.js");
// const userRoutes = require("./routes/userRoutes.js");
// const authRoutes = require("./routes/authRoute.js");

//routes declaration
// app.use("/api/v1/users", userRoutes);
// app.use("/", authRoutes);
app.use("/api/v1/users/", registerRoutes);

// http://localhost:8000/api/v1/users/register

module.exports = { app };
