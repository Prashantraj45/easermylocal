import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    serviceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required:[true,"Service Category is required !"]
    },

    description: {
      type: String,
      required:[true, "Post Descrition is required !"]
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment'
      },
    ],
    tags:[{
      type:String
    }],
    deleted: {
      type: Boolean,
      default: false,
    },
    active:{
      type:String,
      default:"Active"
    },
    status:{
      type:String,
      default:"Active"
    }
  },
  { timestamps: true,versionKey:false }
);

PostSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false }, deleted: { $ne: true } })
  .populate({path:"serviceCategory",select:'name image'}).populate('comments');
  next();
});

export default mongoose.model("Post", PostSchema);
