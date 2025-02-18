const twilio = require("twilio");
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = require("../config");

// Twilio setup (Twilio credentials)
const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async ({ mobile, body }) => {
  await client.messages.create({
    body,
    to: `+91${mobile}`,
    from: TWILIO_PHONE_NUMBER,
  });

  console.log("OTP sent to:", mobile);
};
module.exports = { sendSMS };
