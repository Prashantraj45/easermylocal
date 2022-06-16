"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubscriptionSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true, versionKey: false });
SubscriptionSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false }, deleted: { $ne: true } });
    next();
});
exports.default = mongoose_1.default.model("Subscription", SubscriptionSchema);
