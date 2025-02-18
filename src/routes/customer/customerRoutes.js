const express = require("express");
const router = express.Router();
const { sendOtp } = require("../../controllers/customer/sendOtpController.js");
const {
  verifyOtp,
} = require("../../controllers/customer/verifyOtpController.js");

router.route("/signup/send_otp").post(sendOtp);
router.route("/signup/verify_otp").post(verifyOtp);

module.exports = router;
