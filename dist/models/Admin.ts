import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
    },

    hashed_password: {
      type: String,
    },

    userType: {
      type: String,
      default: "ADMIN",
    },
    mailConfirmed:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true,versionKey:false }
);

export default mongoose.model("Admin", adminSchema);
