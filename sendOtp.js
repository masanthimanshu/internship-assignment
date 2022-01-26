import nodemailer from "nodemailer";
import fs from "node:fs";

// Read SMTP File

const smtpObj = JSON.parse(fs.readFileSync("./secretFile.json"));

// Send OTP Function

function sendOtp(otp, email) {
  let transporter = nodemailer.createTransport({
    host: smtpObj.host, // smtp HostName Here
    port: smtpObj.port, // smtp Port Here
    secure: true,
    auth: {
      user: smtpObj.username, // Username Goes Here
      pass: smtpObj.password, // Password Goes Here
    },
  });

  let mailOptions = {
    from: "temp@indianlegalnetwork.in",
    to: email,
    subject: "Sending Email using Node.js",
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    }
  });

  return { message: "Email Sent" };
}

export default sendOtp;
