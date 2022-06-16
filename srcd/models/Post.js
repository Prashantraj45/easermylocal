"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    serviceCategory: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: [true, "Service Category is required !"]
    },
    description: {
        type: String,
        required: [true, "Post Descrition is required !"]
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User details is required !"]
    },
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Comment'
        },
    ],
    tags: [{
            type: String
        }],
    deleted: {
        type: Boolean,
        default: false,
    },
    active: {
        type: String,
        default: "Active"
    },
    status: {
        type: String,
        default: "Active"
    }
}, { timestamps: true, versionKey: false });
PostSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false }, deleted: { $ne: true } })
        .populate({ path: "serviceCategory", select: 'name image' }).populate('comments');
    next();
});
exports.default = mongoose_1.default.model("Post", PostSchema);
