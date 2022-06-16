import mongoose from "mongoose";

const BusinessCategorySchema = new mongoose.Schema(
  {
    name: {
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

BusinessCategorySchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false }, deleted: { $ne: true } });
  next();
});

export default mongoose.model("BusinessCategory", BusinessCategorySchema);
