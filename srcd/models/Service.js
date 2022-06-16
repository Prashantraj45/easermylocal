"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ServiceSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "ServiceCategory",
        }],
    partner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true, versionKey: false });
ServiceSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false }, deleted: { $ne: true } });
    next();
});
exports.default = mongoose_1.default.model("Service", ServiceSchema);
