import {Request, Response} from 'express'
import Partner from '../../models/Partner';
import User from '../../models/User';

export const checkUserExist = async (req:Request,res:Response) => {
    try {


        const partner = await Partner.findOne({email:req.body.email})
        
        if (partner) {
            let data = {
                flag:true,
                userType:partner.userType,
                aType:partner.aType
            }
            res.status(409).json({message:"Partner exist !",data})
            return;
        }else{
            const user = await User.findOne({email:req.body.email})
            if (user) {
                let data = {
                    flag:true,
                    userType:user.userType,
                    aType:user.aType
                }
                res.status(409).json({message:"User exist !",data})
                return;
            }
        }
        let data = {
            flag:false
        }
        res.status(200).json({message:"User does not exist",data})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Something went wrong !", error });
    }
}
