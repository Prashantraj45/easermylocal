import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },

    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
    }],

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
    },

    active: {
      type: Boolean,
      default: true,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true ,versionKey:false}
);

ServiceSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false }, deleted: { $ne: true } });
  next();
});

export default mongoose.model("Service", ServiceSchema);
