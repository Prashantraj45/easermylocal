import {Request, Response} from 'express'
import Notification from '../../models/Notification'

export const createNotification = async (req:Request, res:Response) => {

    try {
        
        const notification = await Notification.create(req.body)
        res.status(200).json({message:"Notification created !",notification})

    } catch (error:any) {
        let msg = error.message
        res.status(400).json({message:"Something went wrong !",msg})
    }

}

export const deleteNotification = async (req:Request, res:Response) => {

    try {
        let {id} = req.params
        const notification = await Notification.findByIdAndDelete({_id:id})
        res.status(200).json({message:"Notification Deleted !",notification})

    } catch (error:any) {
        let msg = error.message
        res.status(400).json({message:"Something went wrong !",msg})
    }

}