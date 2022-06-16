import { Request, Response } from "express";
import User from "../../models/User";
import bcryptjs from "bcryptjs";
import { createToken, verifyPassword } from "../../helpers/authHelper";
import { sendMessage } from "../../helpers/helpers";
import { resolve } from "path";
import Jwt from "jsonwebtoken";
import { sendMail } from "../../helpers/sendMail/sendMail";



export const userLogin = async (req: Request, res: Response) => {
  try {

    let { email, password, firebaseUid } = req.body;

    //? finding user with email
    // let isExist = await Partner.findOne({email:email})
    const isExist = await User.findOne({email })

    // ? is user not exist with the email
      if (!isExist) {
        res.status(400).json({ message: "User Does not Exist!" });
        return;
      }else{

        if (isExist.aType === 'PASSWORD') {
        
        const encrypt_password = await bcryptjs.hash(password, 10);
        resolve(encrypt_password);
        console.log(encrypt_password, password,isExist.hashed_password)
  
  
          if (await verifyPassword(password, isExist.hashed_password)) {
            let token = await createToken(isExist._id);
            
            return sendMessage(req, res, {
              message: "Logged In Successfully!",
              data: { token, user:isExist },
            });
          }
        }else{

          let user = await User.findOne({firebaseUid:firebaseUid, email:email})

          let token = await createToken(user._id);
            
            return sendMessage(req, res, {
              message: "Logged In Successfully!",
              data: { token, user:isExist },
            });
        }
      }

      



      res.status(400).json({ message: "Email/Password is Incorrect!" });
    return;


  } catch (err) {
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const  resetPassword = async (req:Request,res:Response) => {
    try {
        let {email} = req.body

        const user = await  User.findOne({email})
        if (user) {
            let payload = {email:user.email,id:user._id}
            let secret = user.hashed_password + process.env.SECRET
            let token =  Jwt.sign(payload,secret,{expiresIn:'1h'});
            let message = `
            <h2>Easer password reset</h2>
            <p>We heard that you lost your Easer password. Sorry about that!</p>
      
            <p> But don’t worry! You can use the following link to reset your password</p>
            <a style="background-color: #1F7F4C; font-size: 13px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 8px 10px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href=${`https://easer-dev-api.applore.in/api/user/setpassword/${user._id}/${token}`}><span style="mso-text-raise: 15pt;" >Reset your password  &rarr;</span></a>
            <p>Thanks </p>
            <p>Easer Team </p>
            `;
            sendMail(user.email,"Reset Password",message)
            // res.send(`https://easer-dev-api.applore.in/user/setpassword/${user._id}/${token}`)
            res.send('Mail has been sent to your registered eamil address !')
            return;

        }
        res.send("User not found !")

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
        let user = await User.findById({_id:id})
        if (user) {
            // let payload = {email:user.email,id:user._id}
            let secret = user.hashed_password + process.env.SECRET
            let payload = Jwt.verify(token,secret)
            const hashed_password = await bcryptjs.hash(req.body.password.toString(), 10);
            resolve(hashed_password);
            await User.findByIdAndUpdate({_id:id},{hashed_password})
            res.send('<h3>Password has been updated !</h3>')
            return;
        }
        res.send("<h1>User not found or Invalid User !</h1>")
    } catch (error) {
      res.send("<h1>Link expired !</h1>")
        // res.status(400).json({ message: "Something went wrong !", error });
    }
}


export const getSetPassword = async (req:Request, res:Response) => {

    let {id, token} = req.params

    let user = await User.findById({_id:id})
    


    res.render('index',{email:user.email})
}