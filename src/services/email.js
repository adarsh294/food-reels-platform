import nodemailer from "nodemailer";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.client_id,
  process.env.client_secreat,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.google_refresh_token,
});

const createTransporter = async () => {
  console.log("createTransporter called");

  try {
    const tokenResponse = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: "gmail",

      auth: {
        type: "OAuth2",
        user: process.env.google_user,
        clientId: process.env.client_id,
        clientSecret: process.env.client_secreat,
        refreshToken: process.env.google_refresh_token,
        accessToken: tokenResponse.token,
      },
    });

  } catch (err) {
    console.error("getAccessToken Error:", err);
    throw err;
  }
};

const sendEmail = async (to, subject, text, html) => {

  console.log("Before createTransporter");

  try {

    const transporter = await createTransporter();

    console.log("Transporter created");

    const info = await transporter.sendMail({
      from: `"adarsh" <${process.env.google_user}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);

  } catch (err) {

    console.error("sendEmail Error:", err);

    throw err;
  }
};

export default sendEmail;