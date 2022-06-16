import { Request, Response } from "express";
import Partner from "../../models/Partner";
import Jwt from "jsonwebtoken";
import { sendMail } from "../../helpers/sendMail/sendMail";
import { resolve } from "path";
import bcryptjs from "bcryptjs";


export const  resetPassword = async (req:Request,res:Response) => {
    try {
        let {email} = req.body

        const partner = await  Partner.findOne({email})
        if (partner) {
            let payload = {email:partner.email,id:partner._id}
            let secret = partner.hashed_password + process.env.SECRET
            let token =  Jwt.sign(payload,secret,{expiresIn:'1h'});
            let message = `
            <h2>Easer password reset</h2>
            <p>We heard that you lost your Easer password. Sorry about that!</p>
      
            <p> But don’t worry! You can use the following link to reset your password</p>
            <a style="background-color: #1F7F4C; font-size: 18px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 14px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href=${`https://easer-dev-api.applore.in/api/partner/setpassword/${partner._id}/${token}`}><span style="mso-text-raise: 15pt;" >Reset your password  &rarr;</span></a>
            <p>Thanks </p>
            <p>Easer Team </p>
            `;
            sendMail(partner.email,"Reset Password",message)
            // res.send(`https://easer-dev-api.applore.in/api/partner/setpassword/${partner._id}/${token}`)
            res.status(200).json({message:"Password reset link has been sent to your registered mail !"})
            return;

        }
        res.send("Partner not found !")

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Something went wrong !", error });
    }
}

export const setPassword = async (req:Request,res:Response,next:any) => {
    console.log(req.body)
    try {
        console.log('------------------------------------------------------>',req.body)
        let {id, token} = req.params
        // console.log({params:req.params})
        let partner = await Partner.findById({_id:id})
        if (partner) {
            // let payload = {email:partner.email,id:partner._id}
            let secret = partner.hashed_password + process.env.SECRET
            let payload = Jwt.verify(token,secret)
            const hashed_password = await bcryptjs.hash(req.body.password.toString(), 10);
            resolve(hashed_password);
            await Partner.findByIdAndUpdate({_id:id},{hashed_password})
            res.send('<h3>Password has been updated !</h3> </br><a href="https://easer-dashboard.vercel.app/login">Home</a>')
            return;
        }
        res.send("<h1>Partner not found or Invalid Partner !</h1>")
    } catch (error) {
      res.send("<h1>Link expired !</h1> </br><a href='https://easer-dashboard.vercel.app/login'>Home</a>")
        // res.status(400).json({ message: "Something went wrong !", error });
    }
}


export const getSetPassword = async (req:Request, res:Response) => {

    let {id, token} = req.params

    let partner = await Partner.findById({_id:id})
    


    res.render('index',{email:partner.email})
}