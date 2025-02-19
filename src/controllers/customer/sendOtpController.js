const { Customer } = require("../../models/customer/customerModel.js");
const { REGISTER_OTP_STORE } = require("../../helpers/otpStore.js");
const { ApiError } = require("../../utils/ApiError.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { asyncHandler } = require("../../utils/asyncHandler.js");

const { otpGenerator } = require("../../helpers/otpGenerator.js");
const { sendEmail } = require("../../helpers/nodemailer.js");
const { sendSMS } = require("../../helpers/twilio.js");

// Controller => send OTP signup/registration
const sendOtp = asyncHandler(async (req, res) => {
  // get signupCredentials from req.body
  // check email or mobile and Validate email or mobile format
  // Check if the user already exists based on email or mobile
  // create otp and otpExpiration
  // if user credentials is a mobile number, send OTP via Twilio SMS
  // if user credentials is an email, send OTP using Nodemailer email
  // store OTP and expiration in memory (use email_or_mobile as key)
  // return response
  /*__________________________________________________________________________*/

  // get credentials from req.body
  const { email_or_mobile } = req.body;

  // check email or mobile and validate email or mobile format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileRegex = /^[0-9]{10}$/;

  const isEmail = emailRegex.test(email_or_mobile);
  const isMobile = mobileRegex.test(email_or_mobile);

  if (!isEmail && !isMobile) {
    throw new ApiError(400, "Invalid email or mobile number");
  }

  // Check if the customer already exists based on email or mobile
  const customerExists = await Customer.findOne({
    $or: [{ email: email_or_mobile }, { mobile: email_or_mobile }],
  });
  if (customerExists) {
    throw new ApiError(
      409,
      `customer already exists with ${email_or_mobile}, please login.`
    );
  }

  // create otp and otpExpiration
  const { otp, expiration } = otpGenerator();

  try {
    // Send OTP via email
    if (isEmail) {
      const emailResponse = await sendEmail({
        email: email_or_mobile,
        subject: "E_SHOP Signup/Registration OTP.",
        text: `E_SHOP Signup/Registration OTP.\nThis is your OTP: ${otp}\nIt will expire in 5 minutes.`,
      });
      // console.log("📩 Email Response:", emailResponse);
    }
    // Send OTP via SMS
    if (isMobile) {
      const smsResponse = await sendSMS({
        mobile: email_or_mobile,
        body: `E_SHOP Signup/Registration OTP.\nThis is your OTP: ${otp}\nIt will expire in 5 minutes.`,
      });
      // console.log("📲 SMS Response:", smsResponse);
    }

    // store OTP and expiration in memory (use email_or_mobile as key)
    REGISTER_OTP_STORE.set(email_or_mobile, { otp, expiration });

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, `OTP sent successfully to: ${email_or_mobile}`)
      );
  } catch (error) {
    console.error(
      `❌ OTP sending failed for ${email_or_mobile}:`,
      error.message
    );
    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }
});

module.exports = { sendOtp };
