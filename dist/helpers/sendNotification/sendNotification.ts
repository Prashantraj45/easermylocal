require("dotenv").config();

const FCM = require("fcm-node");
const serverKey = process.env.SERVER_KEY;
const fcm = new FCM(serverKey);

const sendNotification = (title: string, body: string, fcmToken: string) => {
  return new Promise((resolve, reject) => {
    //? this may vary according to the message type (single recipient, multicast, topic, et cetera)
    var message = {
      to: fcmToken,
      //   collapse_key: “your_collapse_key”,
      notification: {
        title: title,
        body: body,
      },
      //   data: {
      //     //? you can send only notification or only data(or include both)
      //     my_key: “my value”,
      //     my_another_key: “my another value”,
      //   },
    };
    fcm.send(message, function (err: any, response: any) {
      if (err) {
        console.log("Something has gone wrong!");
        reject(err);
      } else {
        console.log("Successfully sent with response: ", response);
        resolve("Done");
      }
    });
  });
};

export default sendNotification;
