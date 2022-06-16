import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },

    description: {
      type: String,
    },

    name: {
      type: String,
    },

    duration: {
      type: String,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true ,versionKey:false}
);

SubscriptionSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false }, deleted: { $ne: true } });
  next();
});

export default mongoose.model("Subscription", SubscriptionSchema);
