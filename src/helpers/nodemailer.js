const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASSWORD } = require("../config");

// Nodemailer setup (nodemailer credentials)
const transporter = nodemailer.createTransport({
  service: "gmail", // email provider (like as Outlook,gmail, etc.)
  auth: {
    user: EMAIL, // Your email address to send the OTP from
    pass: EMAIL_PASSWORD, // this is your email app password (generated from your email ) not simple email password
  },
});

const sendEmail = async ({ email, subject, text }) => {
  const mailOptions = {
    from: EMAIL, // sender address (must be the same as the email you use in Nodemailer auth)
    to: email, // receiver's email
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
  console.log("OTP sent to:", email);
};
module.exports = { sendEmail };
