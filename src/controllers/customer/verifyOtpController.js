const { Customer } = require("../../models/customer/customerModel.js");
const { ApiError } = require("../../utils/ApiError.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { asyncHandler } = require("../../utils/asyncHandler.js");
const { REGISTER_OTP_STORE } = require("../../helpers/otpStore.js");
const { generateRefreshToken } = require("../../helpers/jwtTokenGenerator.js");

//Controller => otp verification + signup/register + login
const verifyOtp = asyncHandler(async (req, res) => {
  //get otp and email_or_mobile from customer --> req.body
  // Get OTP from the memory
  // Check OTP expiration
  // Check OTP match
  // OTP is valid, delete it from memory
  // check email or mobile
  // Check if the customer already exists based on email or mobile
  // create new customer in db
  // check customer create or not
  // generate refreshToken
  // return response and set refresh token in cookie => res.cookie("rt",refreshToken,{httpOnly:true,secure:true})
  /*__________________________________________________________________________*/

  //get otp and email_or_mobile from customer --> req.body
  const { email_or_mobile, otp } = req.body;

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
    throw new ApiError(
      400,
      "Invalid OTP, please try again and enter valid OTP"
    );
  }

  // OTP is valid, delete it from memory
  REGISTER_OTP_STORE.delete(email_or_mobile);

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

  // create new customer in db
  const newCustomerData = {};

  if (isEmail) {
    newCustomerData.email = email_or_mobile;
  }
  if (isMobile) {
    newCustomerData.mobile = email_or_mobile;
  }

  // const newCustomer = new Customer({
  //   email: isEmail ? email_or_mobile : undefined, // Use undefined instead of an empty string
  //   mobile: isMobile ? email_or_mobile : undefined,
  // });

  const newCustomer = new Customer(newCustomerData);

  const customer = await newCustomer.save();

  // check customer create or not
  const createdCustomer = await Customer.findById(customer._id).select("-__v");
  if (!createdCustomer) {
    throw new ApiError(
      500,
      "Something went wrong while signup/registering the customer."
    );
  }

  // generate refreshToken and save in db
  const refreshToken = generateRefreshToken(customer._id);

  // return response and set refresh token in cookie
  return res
    .status(201)
    .cookie("rt", refreshToken, { httpOnly: true, secure: true })
    .json(
      new ApiResponse(
        200,
        createdCustomer,
        "OTP verified and customer signup and login Successfully."
      )
    );
});

module.exports = { verifyOtp };
