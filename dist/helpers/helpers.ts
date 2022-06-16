import { Request, Response } from "express";
import moment from "moment";
//? helpers
import {
  createHashedPassword,
  createToken,
  verifyPassword
} from "./authHelper";
import { sendMail } from "./sendMail/sendMail";


export const success = (message: string | {}) => {
  console.log("\x1b[32m", message);
};

export const error = (message: string | {}) => {
  console.log("\x1b[31m", message);
};

export const successBg = (message: string | {}) => {
  console.log("\x1b[42m", message);
};

export const errorBg = (message: string | {}) => {
  console.log("\x1b[41m", message);
};

export const getTimeDifference = () => {
  var timedifference = new Date().getTimezoneOffset();
  timedifference = timedifference + timedifference - timedifference;
};

export const formatDate = (date: string) => {
  var timedifference = new Date().getTimezoneOffset();

  //? Converting negative time difference to positive
  function convert_positive(a: number): number {
    // Check the number is negative
    if (a < 0) {
      // Multiply number with -1
      // to make it positive
      a = a * -1;
    }
    // Return the positive number
    return a;
  }
  timedifference = convert_positive(timedifference);

  return moment(date).add(timedifference, "minutes").toISOString().slice(0, 10);
};

export const sendMessage = (
  req: Request,
  res: Response,
  message: string | {},
  status?: number
) => {
  if (typeof message === 'string') {
    message = { message };
  }
  return res.status(status ? status : 200).json( message );
};

export const sendErrorMessage = (
  req: Request,
  res: Response,
  message: string | {},
  status?: number
) => {
  return res.status(status ? status : 400).json({ message });
};

export const login =
  (Model: any, SubModel1?: any, SubModel2?: any) =>
  async (req: Request, res: Response) => {
    try {
      let { email, password } = req.body;

      //? finding user with email
      let isExist = await Model.findOne({ email });

      //? is user not exist with the email
      if (!isExist) {
        sendErrorMessage(req, res, "User Does not Exist!", 400);
        return;
      }

        
        if (await verifyPassword(password, isExist.hashed_password)) {
          let token = await createToken(isExist._id);

          if (!isExist.mailConfirmed) {
            let html = `<h3>Hello </h3>
            <h4> Click on link to  !</h4>
            <a style="background-color: #1F7F4C; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 5px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href='https://easer-dev-api.applore.in/api/admin/confirmmail/${isExist._id}'>Confirm</a>
            <h5>Confirm it now ! </h5> 
            <p>Thank you</p>
            <p>Easer Team </p>
        `    
            sendMail(isExist.email, 'Welcome to Easer !',html)
  
          res.status(201).json({message:'Account confirmation mail has sent to you, please confirm first !'})
          }

          return sendMessage(req, res, {
            message: "Logged In Successfully!",
            data: { token },
          });
        }



      sendErrorMessage(req, res, "Email/Password is Incorrect!", 400);
      return;
    } catch (err: any) {
      error(err);
    }
  };

export const signup =
  (Model: any, SubModel1?: any, SubModel2?: any) =>
  async (req: Request, res: Response) => {
    try {
      let { email, password } = req.body;
      //? finding user with email
      let isExist;
      isExist = SubModel1 && (await SubModel1.findOne({ email }));

      //? is user already exist with the email
      if (isExist != null || isExist != undefined) {
        sendErrorMessage(
          req,
          res,
          "Email Already Exist/Email Already in Use!",
          400
        );
        return;
      }

      isExist = SubModel2 && (await SubModel2.findOne({ email }));

      //? is user already exist with the email
      if (isExist != null || isExist != undefined) {
        sendErrorMessage(
          req,
          res,
          "Email Already Exist/Email Already in Use!",
          400
        );
        return;
      }

      isExist = await Model.findOne({ email });
      //? is user already exist with the email
      if (isExist != null || isExist != undefined) {
        sendErrorMessage(
          req,
          res,
          "Email Already Exist/Email Already in Use!",

          400
        );
        return;
      }

      console.log({ isExist });

      //? Creating Hashed Password
      let hashed_password = await createHashedPassword(password);

      //? adding one new field as hashed_password
      req.body.hashed_password = hashed_password;

      //? Saving User
      let user = await Model.create(req.body);

      let token = await createToken(user._id);

      

      let html = `<h3>Hello ${req.body.name}</h3>
                    <h4> Click on link to !</h4>
                    <a style="background-color: #1F7F4C; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 5px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href='https://easer-dev-api.applore.in/api/admin/confirmmail/${user._id}'>Confirm</a> 
                    <h5>Confirm it now ! </h5> 
                    <p>Thank you</p>
                    <p>Easer Team </p>
                    `

      sendMail(req.body.email, 'Welcome to Easer !',html)


      return sendMessage(
        req,
        res,
        { message: "User Signed Up Successfully!", data: { token } },
        201
      );
    } catch (err: any) {
      error(err);
      return sendErrorMessage(req, res, err.message);
    }
  };
