import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    partner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Partner'
    },
    review:{
        type:String
    },
    rating: {
      type: Number,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true, versionKey:false})

ReviewSchema.pre(/^find/,function(next) {
    this.find({}).populate({path:'user',select:'name email image'})
    next()
})


export default mongoose.model('Review',ReviewSchema);