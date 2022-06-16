import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    comment:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    deleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true, versionKey:false})

CommentSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false }, deleted: { $ne: true } }).populate({path:'user',select:"name image"});
    next();
  });

export default mongoose.model('Comment',CommentSchema)