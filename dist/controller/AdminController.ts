import { Request, Response } from "express";
import { sendMail } from "../helpers/sendMail/sendMail";
import Admin from "../models/Admin";
import Service from "../models/Service";
import ServiceCategory from "../models/ServiceCategory";
import bcryptjs from "bcryptjs";
import router from "../routes/Admin/AdminAuthRoutes";


export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({})
      .populate("partner")
      .populate("category");
    res.status(200).json({ message: "All services", services });
  } catch (err) {
    res.status(400).json({ message: "Failed !" });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  console.log("Called", req.params);

  try {
    console.log(req.params.id);
    const id = req.params.id;
    let service = await Service.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Deleted !", service });
  } catch (ere) {
    res.status(400).json({ message: "Failed to delete !" });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  console.log("Called !");

  try {
    const { id } = req.params;
    let service = await Service.findOne({ _id: id })
      .populate("category")
      .populate("partner");
    res.status(200).json({ message: "Find Success !", service });
  } catch (err) {
    res.status(400).json({ message: "Failed to find !" });
  }
};

export const getServiceCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let cat = await ServiceCategory.findOne({ _id: id });
    res.status(200).json({ message: "Find Success !", cat });
  } catch (err) {
    res.status(400).json({ message: "Failed to find !" });
  }
};

//-----------------------> Send confirmation mail to admin

export const confirmAdminMail = async (req:Request, res:Response) => {

  try{

    let {id} = req.params
    
    let admin = await Admin.findByIdAndUpdate({_id:id},{mailConfirmed:true},{new:true})
    if (admin) {

      let html = `<h3>Hello ${admin.name} </h3>
      <h4> You are now Admin !</h4>
      <h5>Sign in now ! </h5> 
      <p>Thank you</p>
      <p>Easer Team </p>
  `

      sendMail(admin.email, 'Welcome to Easer !',html)
    }
    res.send(`<h1>Mail confirmation successfully !</h1><a style="background-color: #2276a1; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 5px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href='https://easer-dashboard.vercel.app/login' >Login</a>`)

  }catch(err){
    res.status(400).json({ message: "Something went wrong !", err });
  }

}

//--------------------------->GET ALL ADMINS

export const getAdmins = async (req: Request, res: Response) => {
  try {
    let { page, limit } = req.query;

    let currentPage = parseInt(page as string) ?parseInt(page as string) :1;
    let dataLimit = parseInt(limit as string) ? parseInt(limit as string) : 5;
    let skipValue = (currentPage - 1) * dataLimit;

    let admins = await Admin.find({})
      .sort({ createdAtL: -1 })
      .skip(skipValue)
      .limit(dataLimit);

    const count = await Admin.find({}).countDocuments();
    let allAdmins = await Admin.find({});

    res
      .status(200)
      .json({
        message: "All Admins !",
        count,
        totalPages: Math.ceil(count / dataLimit),
        admins,
        allAdmins,
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to find !", err });
  }
};

//----------------------------> Delete Admin

export const delteAdmin = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let admin = await Admin.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Admin deleted Success !", admin });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete !", err });
  }
};


//----------------------------> reset passsword send link to mail

export const resetPasswordlink = async (req:Request, res:Response) =>{

  try{

    let {forgotEmail} = req.body

    const admin = await Admin.findOne({email:forgotEmail})

    if(admin){
      let message = `
      <h2>Easer password reset</h2>
      <p>We heard that you lost your Easer password. Sorry about that!</p>

      <p> But don’t worry! You can use the following link to reset your password</p>
      <a style="background-color: #1F7F4C; font-size: 18px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 14px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href=${`https://easer-dashboard.vercel.app/forgotpassword/${admin._id}`}><span style="mso-text-raise: 15pt;" >Reset your password  &rarr;</span></a>
      <p>Thanks </p>
      <p>Easer Team </p>
      `;
      console.log(req.body,admin)
      sendMail(forgotEmail, 'Reset Password', message)
      res.status(200).json({message:'Password reset link sent !'})
    }else{
      res.status(400).json({ message: "Admin not found !" });
    }


  }catch(err){
    res.status(400).json({ message: "Something went wrong !", err });
  }
  
}

export const resetPassword = async (req:Request, res:Response) => {

  try{

    const {password} = req.body
    const {id} = req.params
    let hashed_password = await bcryptjs.hash(password, 10);

    const admin = await Admin.findByIdAndUpdate({_id:id},{hashed_password:hashed_password},{new:true})
    res.status(200).json({message:"password reset successfully !",admin})

  }catch(err){
    res.status(400).json({ message: "Something went wrong !", err });
  }

}