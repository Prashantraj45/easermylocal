import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { resolve } from "path";
import { createToken } from "../../helpers/authHelper";
import { sendMessage } from "../../helpers/helpers";
import { sendMail } from "../../helpers/sendMail/sendMail";
import Partner from "../../models/Partner";
import PartnerDocument from "../../models/PartnerDocument";
import Review from "../../models/Review";
import Service from "../../models/Service";
import User from "../../models/User";
import { body } from "express-validator";

export const createPartner = async (req: Request, res: Response) => {

  try {

    //--------------> Send message is company number already exists
    if (req.body.companyNumber) {
      let companyFound = await Partner.findOne({companyNumber:req.body.companyNumber})
      if (companyFound) {
        res.status(400).json({message:"Company number already exists !"})
        return;
      }
    }


    const {name, email, password, phone, address, commission, rating, image, charges, service, passport, drivingLicense, citizenCard, biometricResidencePermit, nationalIdentityCard, companyNumber, directorDocument, aType,} = req.body;
    let encrypt_password = ''
    if (aType && aType.toUpperCase() != "PASSWORD") {

      if (!req.body.firebaseUid) {
        res.status(400).json({ message: "firebaseUid required !" });
        return;
      } else if (req.body.firebaseUid && req.body.firebaseUid.length < 28) {
        res.status(400).json({ message: "Invalid firebaseUid !" });
        return;
      }

    } else {

      encrypt_password = await bcryptjs.hash(password, 10);
      resolve(encrypt_password);

    }


    let userExist = await User.findOne({
      $or: [{ email: req.body.email }],
    });

    let partnerExist = await Partner.findOne({
      $or: [{ email: req.body.email }],
    });

    if (userExist || partnerExist) {
      res.status(409).json({ message: "Eamil/Phone already exists !" });
      return;
    }

    const doc = await PartnerDocument.create({
      ...req.body
    });

    const partner = await Partner.create({
      ...req.body,
      hashed_password: encrypt_password,
      documents: doc._id,
      firebaseUid:req.body.firebaseUid
    });


    const updatePartner = await PartnerDocument.findByIdAndUpdate(
      { _id: doc._id },
      { partner: partner._id }
    );
    console.log(updatePartner);
    let message = `
                  <h1>Hi, ${name}</h1>
                  <h3>You are now Parner !</h3>
                  <h4> Sign in Now !</h4>
                  `;

    sendMail(req.body.email, "Easer Registration", message);

    let token = await createToken(partner._id);
    await Partner.findByIdAndUpdate({ _id: partner._id }, { userToken: token });
    res.status(200).json({ message: "Success !", data: { partner, token } });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const partnerLogin = async (req: Request, res: Response) => {
  try {
    let { email, password, firebaseUid } = req.body;

    //? finding user with email
    // let isExist = await Partner.findOne({email:email})
    const isExist = await Partner.findOne({ email });

    console.log(
      "-------------------------------------->",
      req.body.eamil,
      isExist
    );
    // ? is user not exist with the email
    if (!isExist) {
      res.status(400).json({ message: "User Does not Exist!" });
      return;
    } else {

      let user = await User.findOne({
        firebaseUid: firebaseUid,
        email: email,
      });
      let token = await createToken(isExist._id);
      return sendMessage(req, res, {
        message: "Logged In Successfully!",
        data: { token },
      });

    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const getPartners = async (req: Request, res: Response) => {
  try {
    let { page, limit } = req.query;
    let currentPage = parseInt(page as string) ? parseInt(page as string) : 1;
    let dataLimit = parseInt(limit as string) ? parseInt(limit as string) : 5;
    let skipValue = (currentPage - 1) * dataLimit;

    const allPartners = await Partner.find({ verified: true });
    const partners = await Partner.find({ verified: true })
      .skip(skipValue)
      .limit(dataLimit)
      .populate("service")
      .populate("documents")
      .sort({ createdAt: -1 });

    let count = await Partner.find({ verified: true }).countDocuments();
    let totalPages = Math.ceil(count / dataLimit);

    res.status(200).json({
      message: "Success !",
      count,
      totalPages,
      page,
      partners,
      allPartners,
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong !" });
  }
};

export const getRequestedPartners = async (req: Request, res: Response) => {
  try {
    let { page, limit } = req.query;
    let currentPage = parseInt(page as string) ? parseInt(page as string) : 1;
    let dataLimit = parseInt(limit as string) ? parseInt(limit as string) : 5;
    let skipValue = (currentPage - 1) * dataLimit;

    const allPartners = await Partner.find({ verified: false });
    const partners = await Partner.find({ verified: false })
      .skip(skipValue)
      .limit(dataLimit)
      .populate("service")
      .populate("documents")
      .sort({ createdAt: -1 });

    let count = await Partner.find({ verified: false }).countDocuments();
    let totalPages = Math.ceil(count / dataLimit);

    res.status(200).json({
      message: "Success !",
      count,
      totalPages,
      page,
      partners,
      allPartners,
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong !" });
  }
};

export const approvePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      { _id: id },
      { verified: verified }
    );
    res.status(200).json({ message: " Update Success !", partner });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

///Approve api for admin to for partner verification

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const updatePartner = await Partner.findOne({_id:id})

    // if(!(updatePartner.service == req.body.service)){
    //     await Service.findByIdAndUpdate({_id:updatePartner.service},{partner:null})
    // }

    const {
      name,
      email,
      phone,
      address,
      commission,
      rating,
      image,
      charges,
      service,
      verified,
      passport,
      drivingLicense,
      citizenCard,
      biometricResidencePermit,
      nationalIdentityCard,
      companyNumber,
      directorDocument,
    } = req.body;

    const doc = await PartnerDocument.updateOne(
      { partner: id },
      {
        passport,
        drivingLicense,
        citizenCard,
        biometricResidencePermit,
        nationalIdentityCard,
        companyNumber,
        directorDocument,
      }
    );

    const partner = await Partner.findByIdAndUpdate(
      { _id: id },
      {
        name: name,
        email: email,
        image: image,
        charges: charges,
        phone: phone,
        address: address,
        commission: commission,
        rating: rating,
        service: service,
        verified: verified,
      }
    );

    await Service.findByIdAndUpdate({ _id: service }, { partner: id });
    res.status(200).json({ message: " Update Success !", partner });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Partner.findByIdAndDelete({ _id: id });
    await PartnerDocument.findOneAndDelete({ partner: id })
    res.status(200).json({ message: "Deleted Success !" });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const partnerServices = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let services = await Service.find({ partner: id });
    res.status(200).json({ message: "Partner services !", services });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

// GET PARTNER BY ID
export const getPartnerById = async (req: Request, res: Response) => {
  let { id } = req.params;

  try {
    let partner = await Partner.findOne({ _id: id }).populate("documents");
    res.status(200).json({ message: "Partner !", partner });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

//--------------------------------> Add review
export const addReview = async (req: Request, res: Response) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.body.partner)) {
      let review = await Review.create({ ...req.body });
      await Partner.findByIdAndUpdate(
        { _id: req.body.partner },
        { $push: { review: review._id } }
      );
      res.status(200).json({ message: "Review Added !" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

//-------------------------------> Delete review

export const deleteReview = async (req: Request, res: Response) => {
  try {
    let { reviewId, userId } = req.body;
    let userReview = await Review.findOne({ user: userId });
    //----------------> Check user is deleting their own review
    if (userReview?._id?.equals(reviewId)) {
      let review = await Review.findByIdAndDelete({ _id: reviewId });
      res.status(200).json({ message: "Review Deleted !", review });
      return;
    } else {
      res.status(400).json({ message: "User cannot delete other's review !" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};


export const searchPartners = async (req: Request, res: Response) => {

  try {

    const { name, service } = req.query
    const data: any = []
    const partners = await Partner.find({}).populate({ path: "service", select: "name image active" });
    const searchData = partners.forEach(partner => {

      if (partner?.name?.includes(name) || partner?.service?.name?.includes(service)) {
        data.push(partner)
      }

    })

    res.status(200).json({ message: "All searched partner !", data })


  } catch (error) {

    console.log(error);
    res.status(400).json({ message: "Something went wrong !", error });
  }

}