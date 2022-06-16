"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PartnerSchema = new mongoose_1.default.Schema({
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
        unique: true,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "ServiceCategory",
        },
    ],
    documents: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    notificationCount: {
        type: Number,
        default: 3
    },
    companyNumber: {
        type: Number,
        unique: [true, 'Company number already exists !'],
        required: [true, 'Company number is required !']
    },
    bannerImages: [
        {
            type: String,
        }
    ]
}, { timestamps: true, versionKey: false });
PartnerSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false }, deleted: { $ne: true } })
        .populate({ path: "review", select: "rating review user" });
    // .populate({path:"service",select:"name image active"});
    next();
});
exports.default = mongoose_1.default.model("Partner", PartnerSchema);
