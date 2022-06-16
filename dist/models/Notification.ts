import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required !"]
    },
    description:{
        type:String,
        required:[true,"Notification Description is required !"]
    },
    image:{
        type:String,
        required:[true,'Banner image is reequired !']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true, versionKey:false})

export default mongoose.model('Notification',notificationSchema)