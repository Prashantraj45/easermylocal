import { Request, Response } from "express";
import User from "../../models/User";
import bcryptjs from "bcryptjs";
import { resolve } from "path";
import lodash from "lodash";
import UserReferral from "../../models/UserReferral";
import { createToken } from "../../helpers/authHelper";
import Partner from "../../models/Partner";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, image } = req.body;

    let userExist = await User.findOne({
      $or: [{ email: req.body.email }],
    });

    let partnerExist = await Partner.findOne({
      $or: [{ email: req.body.email }],
    });

    if (userExist || partnerExist) {
      res.status(409).json({ message: "Eamil/Phone already exists !",partnerExist,userExist });
      return;
    } 

    let randomAlphabets = ["a", "b", "c", "d", "e", "f", "i", "j", "k", "l"];
    let referralCode = name.slice(0, 3);
    for (let index = 0; index < 5; index++) {
      let random = Math.floor(Math.random() * randomAlphabets.length);
      referralCode += randomAlphabets[random];
    }

    referralCode += Math.floor(100000 + Math.random() * 900000);

    //find user whoes refer code user enters and increase referral user membership

    const findRefUser = await UserReferral.findOne({
      code: req.body.referralCode,
    });
    if (findRefUser) {
      let findUser = await User.findOne({ _id: findRefUser.user });
      let userDate = new Date(findUser.premiumDate);
      let add30Days = new Date(userDate.setDate(userDate.getDate() + 30));
      let today = new Date();
      await User.findByIdAndUpdate(
        { _id: findRefUser.user },
        { premiumDate: add30Days, isPremium: today <= add30Days ? true : false }
      );
    }
    if (password) {
  
      const ref = await UserReferral.create({ code: referralCode });
  
      const hashed_password = await bcryptjs.hash(password.toString(), 10);
      resolve(hashed_password);

      const user = await User.create({ ...req.body, hashed_password });
      await UserReferral.findByIdAndUpdate({ _id: ref._id }, { user: user._id });
  
      await User.findByIdAndUpdate({ _id: user._id }, { myReferral: ref._id });
  
      await UserReferral.findOneAndUpdate(
        { code: req.body.referralCode },
        { $push: { referrals: user._id } }
      );
  
      const token = await  createToken(user._id)
      res.status(200).json({ message: "User created Successfully !", data:{user, token} });
  
    }else{
      const ref = await UserReferral.create({ code: referralCode });
      if (req.body.firebaseUid && req.body.firebaseUid.length < 28 ) {
        res.status(400).json({ message: "Invalid firebaseUid !"});
        return;
      }
  

      const user = await User.create({ ...req.body, aType: req.body.aType ? req.body.aType : 'SOCIAL' });
      await UserReferral.findByIdAndUpdate({ _id: ref._id }, { user: user._id });
  
      await User.findByIdAndUpdate({ _id: user._id }, { myReferral: ref._id });
  
      await UserReferral.findOneAndUpdate(
        { code: req.body.referralCode },
        { $push: { referrals: user._id } }
      );
  
      const token = await  createToken(user._id)
      res.status(200).json({ message: "Created Success !", data:{user, token} });
    }
 
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    let currentPage = parseInt(page as string)
      ? parseInt(page as string)
      : parseInt(page as string);
    let docLimit = parseInt(limit as string)
      ? parseInt(limit as string)
      : parseInt(limit as string);

    let skipValue = (currentPage - 1) * docLimit;

    const allUsers = await User.find({});
    const users = await User.find({})
      .sort({ isPremium:-1, createdAt: -1 })
      .skip(skipValue)
      .limit(docLimit)
      .populate("myReferral")
      .populate({
        path: "myReferral",
        populate: {
          path: "referrals",
        },
      });
    const count = await User.find({}).countDocuments();

    res.status(200).json({
      message: "All users",
      count,
      totalPages: Math.ceil(count / docLimit),
      users,
      allUsers,
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong !" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    console.log("called !", req.params);

    const { id } = req.params;
    let user = await User.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Deleted Success !", user });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong !" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    console.log(req.params, req.body);
    let { id } = req.params;

    let user = await User.findOne({ _id: id });

    let updatDate = lodash.extend(user, req.body);

    let updateUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: updatDate },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "User Successfully Updated !", updateUser });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let user = await User.findOne({ _id: id });
    res.status(200).json({ message: "User found !", user });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", err });
  }
};

export const userReferrals = async (req: Request, res: Response) => {
  try {
    let { page, limit } = req.query;

    let dataLimit = parseInt(limit as string) ? parseInt(limit as string) : 1;
    let currentPage = parseInt(page as string) ? parseInt(page as string) : 5;
    let skipValue = (currentPage - 1) * dataLimit;
    let count = await UserReferral.find({}).countDocuments()
    let totalPages = Math.ceil(count/ dataLimit)

    let referrals = await UserReferral.find({})
      .sort({ createdAt: -1 })
      .skip(skipValue)
      .limit(dataLimit)
      .populate("user")
      .populate("referrals");
    res.status(200).json({ message: "All Referrals !",count,totalPages, referrals });
  } catch (err) {
    console.log(err);

    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const getReferralById = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;

    let referrals = await UserReferral.findOne({ _id: id })
      .populate("user")
      .populate("referrals");
    res.status(200).json({ message: "GET Referral !", referrals });
  } catch (err) {
    console.log(err);

    res.status(400).json({ message: "Something went wrong !", err });
  }
};

////////--------------------------> increase user premium membership for onw month

// export const increasePremium = async (req:Request, res:Response) => {

//   try{

//     let user = await User.findByIdAndUpdate({_id:id})

//   }

// }
