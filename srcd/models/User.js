"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
    },
    hashed_password: {
        type: String,
    },
    image: {
        type: String,
    },
    phone: {
        type: Number,
        unique: true,
    },
    referralCode: {
        type: String,
        default: ''
    },
    myReferral: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserReferral'
    },
    userType: {
        type: String,
        default: "USER",
    },
    active: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    viewCount: {
        type: Number,
        default: 3,
    },
    postCount: {
        type: Number,
        default: 3
    },
    isPremium: {
        type: Boolean,
        default: true,
    },
    premiumDate: {
        type: Date,
        default: Date.now()
    },
    firebaseUid: {
        type: String
    },
    aType: {
        type: String,
        default: "PASSWORD"
    }
}, { timestamps: true, versionKey: false });
UserSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false }, deleted: { $ne: true } });
    next();
});
exports.default = mongoose_1.default.model("User", UserSchema);
