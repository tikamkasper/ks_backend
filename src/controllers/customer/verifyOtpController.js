const { Customer } = require("../../models/customer/customerModel.js");
const { CustomError } = require("../../utils/CustomError.js");
const { Response } = require("../../utils/Response.js");
const { asyncHandler } = require("../../utils/asyncHandler.js");
const { REGISTER_OTP_STORE } = require("../../helpers/otpStore.js");
const { generateRefreshToken } = require("../../helpers/jwtTokenGenerator.js");

//Controller => otp verification + signup/register + login
const verifyOtp = asyncHandler(async (req, res, next) => {
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
    return next(new CustomError("OTP not found or expired", 400));
  }

  // Check OTP expiration
  if (Date.now() > storedOtpData.expiration) {
    REGISTER_OTP_STORE.delete(email_or_mobile); // Delete expired OTP
    return next(new CustomError("OTP has expired", 400));
  }

  // Check OTP match
  if (storedOtpData.otp !== otp) {
    return next(
      new CustomError("Invalid OTP. Please try again and enter valid OTP", 400)
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
    return next(new CustomError("Invalid email or mobile number", 400));
  }
  // Check if the customer already exists based on email or mobile
  const customerExists = await Customer.findOne({
    $or: [{ email: email_or_mobile }, { mobile: email_or_mobile }],
  });
  if (customerExists) {
    return next(
      new CustomError(
        `Customer already exists with ${email_or_mobile}. Please go to login.`,
        409
      )
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
    return next(
      new CustomError(
        "Something went wrong while signup/registering the customer.",
        500
      )
    );
  }

  // generate refreshToken and save in db
  const refreshToken = generateRefreshToken(customer._id);

  // set refresh token in cookie
  res.cookie("rt", refreshToken, { httpOnly: true, secure: true });
  // return response with customer data
  return Response.success(
    res,
    201,
    "OTP verified and Customer signup with login Successfully.",
    createdCustomer
  );
});

module.exports = { verifyOtp };
