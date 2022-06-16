const nodemailer = require("nodemailer");

//? Helpers
import { successBg } from "../helpers";

let sendMail = (email: string, subject: string, html: string) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "nitish.kumar@applore.in",
        clientId:
          "1014253619460-q0j63fg56eks5ankcf4519s83gm7imgq.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken:
          "1//04rmrJenjJWUMCgYIARAAGAQSNwF-L9IrcA2PabdXf7W0Ec4GizM2-NOZ8Hot9_UB1rMvR6hHMSKH7aphVVaUJVK90CLohV5pEsw",
      },
    });

    console.log("EMAIL IN MESSAGE", email);
    console.log("SUBJECT IN MESSAGE", subject);
    console.log("HTML IN MESSAGE", html);

    let mailOptions = {
      to: email,
      subject: subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function (err: any) {
      if (err) {
        reject(err);
      }
      successBg("Message Send!");
      resolve("Message Send!");
    });
  });
};



export { sendMail };
