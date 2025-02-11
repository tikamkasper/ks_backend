const { Router } = require("express");

const {
  sendRegisterOtp,
} = require("../../controllers/user/register/sendRegisterOtpController.js");
const {
  verifyRegisterOtp,
} = require("../../controllers/user/register/verifyRegisterOtpController.js");
const {
  registerUser,
} = require("../../controllers/user/register/registerController.js");

const router = Router();

router.route("/register/send/otp").post(sendRegisterOtp);
router.route("/register/verify/otp").post(verifyRegisterOtp);
router.route("/register").post(registerUser);

module.exports = router;
