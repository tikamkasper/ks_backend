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
  // check email or mobile
  // Check if the user already exists based on email or mobile
  // create otp and otpExpiration
  // if user credentials is a mobile number, send OTP via Twilio SMS
  // f user credentials is an email, send OTP using Nodemailer emiail
  // store OTP and expiration in memory (use email_or_mobile as key)
  // return response
  /*__________________________________________________________________________*/

  // get credentials from req.body
  const { email_or_mobile } = req.body;

  // check email or mobile
  const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    email_or_mobile
  );
  const isMobile = /^[0-9]{10}$/.test(email_or_mobile);

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
      "customer already exists with this email or mobile, please login."
    );
  }

  // create otp and otpExpiration
  const { otp, expiration } = otpGenerator();

  try {
    // If costomer entered an email, send OTP using Nodemailer email
    if (isEmail) {
      await sendEmail({
        email: email_or_mobile,
        subject: "E_SHOP Signup/Registration OTP.",
        text: `This is your OTP: ${otp}.\n It will expire in 5 minutes.`,
      });
    }
    // If costomer entered a mobile number ,send OTP via Twilio SMS
    if (isMobile) {
      await sendSMS({
        mobile: email_or_mobile,
        body: `E_SHOP Signup/Registration OTP.
        This is your OTP: ${otp}
        It will expire in 5 minutes.`,
      });
    }

    // store OTP and expiration in memory (use email_or_mobile as key)
    REGISTER_OTP_STORE.set(email_or_mobile, { otp, expiration });

    res
      .status(200)
      .json(new ApiResponse(200, {}, `OTP sent to: ${email_or_mobile}`));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error sending OTP");
  }
});

module.exports = { sendOtp };
