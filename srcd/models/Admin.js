"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    hashed_password: {
        type: String,
    },
    userType: {
        type: String,
        default: "ADMIN",
    },
    mailConfirmed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model("Admin", adminSchema);
