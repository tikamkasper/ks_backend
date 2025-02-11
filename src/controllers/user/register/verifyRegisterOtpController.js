const { ApiError } = require("../../../utils/ApiError.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");
const { asyncHandler } = require("../../../utils/asyncHandler.js");

// Verify register OTP controller
const verifyRegisterOtp = asyncHandler(async (req, res) => {
  //get otp from user --> req.body
  // Get OTP from the memory
  //verify otp and check otp expiration
  // if OTP is valid
  // delete otp from memory
  //send response OTP verified successfully

  //get otp from user --> req.body
  const { otp } = req.body;
  // Get OTP from the memory
  const storedOtpData = REGISTER_OTP_STORE.get("otpWithExpiration");

  if (
    !storedOtpData ||
    storedOtpData.otp !== otp ||
    Date.now() > storedOtpData.expiration
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // OTP is valid
  // delete otp from memory
  OTP_STORE.delete("otpWithExpiration");
  //send response OTP verified successfully
  res.status(200).json(new ApiResponse(200, {}, "OTP verified successfully"));
});

module.exports = { verifyRegisterOtp };
