import Jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

//? helpers
import {
  errorBg,
  error,
  sendErrorMessage,
  sendMessage,
} from "../helpers/helpers";

//? Models
import Admin from "../models/Admin";
import Partner from "../models/Partner";
import User from "../models/User";

const getUser = (user: { _id: string } | any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData =
        (await Admin.findById({ _id: user._id })) ||
        (await Partner.findById({ _id: user._id })) ||
        (await User.findById({ _id: user._id }));

      resolve(userData);
    } catch (err: any) {
      error(err);
      reject(err);
    }
  });
};


export const checkGuestAccess = () => {
  return async (req:Request, res:Response, next:any) => {
      const auth = { username: process.env.BASIC_AUTH_USERNAME, password: process.env.BASIC_AUTH_PASSWORD }
      const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
      const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':')
      if (username && password && username === auth.username && password === auth.password) {
          return next()
      }
      res.status(401).json({ error: "Unauthorized Request" })
  }
}



export const checkTokenAndPermission =
  (permission: string[]) =>
  async (req: Request | any, res: Response, next: any): Promise<any> => {
    try {
      let token =
        (req.headers.authorization && req.headers.authorization) ||
        (req.headers.authorization &&
          req?.headers?.authorization.split("Bearer")[1]);

      console.log("token", token);
      console.log({permission})

      permission= permission.map(x=>x.toUpperCase())

      //? Checking whether token is null or not
      if (!token || token == null) {
        return res
          .status(400)
          .json({ error: true, message: "Unauthorized Request!" });
      }

      if (token.startsWith("Bearer ")) {
        //? Removing Bearer from token string
        token = token.slice(7, token.length).trimLeft();
      }

      if (!token) {
        return res.status(401).json({ error: true, message: "Invalid Token!" });
      }

      let user = await Jwt.verify(
        token,
        process.env.SECRET ? process.env.SECRET : ""
      );

      console.log("user", user);

      let userData: {} | any = await getUser(user);

      console.log("userData", userData);

      if (!userData || userData == null) {
        return res
          .status(400)
          .json({ error: true, message: "User Not Found!" });
      }

      console.log({ permission });

      console.log("permission include", permission.includes(userData.userType));

      if (!permission.includes(userData?.userType?.toUpperCase())) {
        return res
          .status(400)
          .json({ error: true, message: "You Don't Have Enough Permission!" });
      }
      req.user = userData;
      next();
    } catch (err: any) {
      error(err);
    }
  };

//? Interface for Request
interface requestInterface extends Request {
  user?: any;
}

//? For Checking And
export const checkViewCountAndLeads = async (
  req: requestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    let { userType, viewCount, leadCount, isPremium } = req.user;

    //? if there will be no userType
    if ((userType && userType == null) || userType == undefined) {
      return sendMessage(req, res, "No User Type in req.user...");
    }
    console.log('--------------------------------------------------->',req.user)
    //? if the incoming user is of type user
    if (userType == "USER") {
      //? checking user count
      if (viewCount == 0 && !isPremium) {
        return sendMessage(req, res, "No Count Left to View Partner Profile!");
      }

      if (isPremium) {
        next()
        return;
      }
      //? substracting 1 viewCount
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $inc: { viewCount: -1 } }
      );
      next();
      return;
    }

    //? if the incoming user is of type partner
    if (userType == "PARTNER") {
      //? checking user count
      if (leadCount == 0 && !isPremium) {
        return sendMessage(req, res, "No Lead Count Left!");
      }

      if (isPremium) {
        next()
        return;
      }

      //? substracting 1 leadCount if user is not premium
      await Partner.findByIdAndUpdate(
        { _id: req.user._id },
        { $inc: { leadCount: -1 } }
      );
      next();
    }

    if (userType == "ADMIN"){
      next()
      return;
    }

    // next();
  } catch (err: any) {
    error(err);
    return sendErrorMessage(req, res, err.message);
  }
};
