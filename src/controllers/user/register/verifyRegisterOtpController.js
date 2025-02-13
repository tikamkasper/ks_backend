const { ApiError } = require("../../../utils/ApiError.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const { asyncHandler } = require("../../../utils/asyncHandler.js");
const { REGISTER_OTP_STORE } = require("../../../helpers/otpStore.js");

// Verify register OTP controller
const verifyRegisterOtp = asyncHandler(async (req, res) => {
  //get otp and email_or_mobile from user --> req.body
  // Get OTP from the memory
  //verify otp and check otp expiration
  // if OTP is valid
  // delete otp from memory
  //send response OTP verified successfully

  //get otp and email_or_mobile from user --> req.body
  const { email_or_mobile, role, otp } = req.body;

  // Get OTP from the memory
  const storedOtpData = REGISTER_OTP_STORE.get(email_or_mobile);

  if (!storedOtpData) {
    throw new ApiError(400, "OTP not found or expired");
  }

  // Check OTP expiration
  if (Date.now() > storedOtpData.expiration) {
    REGISTER_OTP_STORE.delete(email_or_mobile); // Delete expired OTP
    throw new ApiError(400, "OTP has expired");
  }

  // Check OTP match
  if (storedOtpData.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP is valid, delete it from memory
  REGISTER_OTP_STORE.delete(email_or_mobile);

  //send response OTP verified successfully
  res
    .status(200)
    .json(new ApiResponse(200, { role }, "OTP verified successfully"));
});

module.exports = { verifyRegisterOtp };
