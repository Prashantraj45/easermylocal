import mongoose from "mongoose"

const  UserReferral = new mongoose.Schema({

    code :{
        type:String,
        unique:true
    },
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    referrals:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]

},{timestamps:true,versionKey:false})

export default mongoose.model("UserReferral", UserReferral)