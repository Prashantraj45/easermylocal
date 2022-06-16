import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
    },

    hashed_password: {
      type: String,
    },

    userType: {
      type: String,
      default: "PARTNER",
    },

    active: {
      type: Boolean,
      default: true,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    leadCount: {
      type: Number,
      default: 3,
    },
    userToken: {
      type: String,
    },
    image: {
      type: String,
    },
    charges: {
      type: String,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    commission: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
    },
    hourRate: {
      type: Number,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    service: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
      },
    ],
    documents: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PartnerDocument",
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    aType: {
      type: String,
      default: 'PASSWORD'
    },
    fcmToken: {
      type: String
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    notificationCount: {
      type: Number,
      default: 3
    },
    companyNumber:{
      type:Number,

    },
    bannerImages: [
      {
        type: String,
      }
    ],
    firebaseUid: String
  },
  { timestamps: true, versionKey: false }
);

PartnerSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false }, deleted: { $ne: true } })
    .populate({ path: "review", select: "rating review user" })
  // .populate({path:"service",select:"name image active"});
  next();
});

export default mongoose.model("Partner", PartnerSchema);
