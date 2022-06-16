import mongoose from "mongoose";

const PartnerDocumentSchema = new mongoose.Schema(
  {
    passportVerified: {
      type: Boolean,
      default: false,
    },
    drivingLicenseVerified: {
      type: Boolean,
      default: false,
    },
    citizenCardVerified: {
      type: Boolean,
      default: false,
    },
    biometricResidencePermitVerified: {
      type: Boolean,
      default: false,
    },
    nationalIdentityCardVerified: {
      type: Boolean,
      default: false,
    },
    passport: {
      type: String,
    },
    drivingLicense: {
      type: String,
    },
    citizenCard: {
      type: String,
    },
    biometricResidencePermit: {
      type: String,
    },
    nationalIdentityCard: {
      type: String,
    },
    partner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Partner'
    },
      companyNumber:{
        type:Number,
        // required:[true,'Company number is required !']
      },
      directorDocument:{
        type:String
      }
  },
  { timestamps: true ,versionKey:false}
);

export default mongoose.model("PartnerDocument", PartnerDocumentSchema);
