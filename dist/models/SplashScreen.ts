import mongoose from "mongoose";

const SplashScreenSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim:true,
      required: [true, " title is required !"],
    },
    description: {
      type: String,
      required: [true, "Description is required !"],
    },
    image: {
      type: String,
      required:[true, "Image is required !"]
    },
    status: {
      type: Boolean,
      default: false,
    },
    timestamp:{
        type:Date,
        default:Date.now()
    }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("SplashScreen", SplashScreenSchema);
