import mongoose from "mongoose";

const ServiceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique:true,
    },

    image: {
      type: String,
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

ServiceCategorySchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false }, deleted: { $ne: true } });
  next();
});

export default mongoose.model("ServiceCategory", ServiceCategorySchema);
