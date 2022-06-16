import {Request,Response} from 'express'
import { sendMail } from '../helpers/sendMail/sendMail'

export const SendmailController = (req:Request,res:Response) => {

    try{

        
        let {mail,subject,message} = req.body

        
        if (typeof(mail == 'string')) {
            //for single mail
            sendMail(mail,subject,message)
        }else{
            //for multiple users 
            mail.map((data:any) => sendMail(data,subject,message))

        }
        res.status(200).json({ message: "Mail sent !" });

        
    }catch(err){
        res.status(400).json({message:"Something went wrong !",err})
    }

}