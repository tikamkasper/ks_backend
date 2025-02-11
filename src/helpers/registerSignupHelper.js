const { User } = require("../models/user/userModel.js");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { ApiError } = require("../utils/ApiError.js");
const {
  TWILIO_SID,
  TWILIO_AUTH_TOKEN,
  EMAIL,
  EMAIL_PASSWORD,
} = require("../config/index.js");

// Twilio setup (Twilio credentials)
const accountSid = TWILIO_SID;
const authToken = TWILIO_AUTH_TOKEN;
exports.twilioClient = twilio(accountSid, authToken);

// Nodemailer setup
exports.nodemailerTransporter = nodemailer.createTransport({
  service: "gmail", // email provider (e.g., Outlook, SendGrid,gmail, etc.)
  auth: {
    user: EMAIL, // Your email address to send the OTP from
    pass: EMAIL_PASSWORD, // Your email password or app password
  },
});

// Generate OTP and expiration time
exports.otpGenerator = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiration = Date.now() + 5 * 60 * 1000; // Set absolute expiration time (5 minutes from now)
  return { otp, otpExpiration };
};

//Generate Refresh Token
exports.generateRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();

    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });
    return refreshToken;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh token"
    );
  }
};
