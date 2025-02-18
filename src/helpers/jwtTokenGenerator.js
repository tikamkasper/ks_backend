const { Customer } = require("../models/customer/customerModel.js");
const { ApiError } = require("../utils/ApiError.js");

//Generate Refresh Token
const generateRefreshToken = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId);
    const refreshToken = customer.generateRefreshToken();

    customer.refresh_token = refreshToken;
    await customer.save({ validateBeforeSave: false });
    return refreshToken;
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating referesh token"
    );
  }
};

module.exports = { generateRefreshToken };
