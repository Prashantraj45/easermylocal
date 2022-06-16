"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.resetPasswordlink = exports.delteAdmin = exports.getAdmins = exports.confirmAdminMail = exports.getServiceCategoryById = exports.getServiceById = exports.deleteService = exports.getServices = void 0;
const sendMail_1 = require("../helpers/sendMail/sendMail");
const Admin_1 = __importDefault(require("../models/Admin"));
const Service_1 = __importDefault(require("../models/Service"));
const ServiceCategory_1 = __importDefault(require("../models/ServiceCategory"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield Service_1.default.find({})
            .populate("partner")
            .populate("category");
        res.status(200).json({ message: "All services", services });
    }
    catch (err) {
        res.status(400).json({ message: "Failed !" });
    }
});
exports.getServices = getServices;
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Called", req.params);
    try {
        console.log(req.params.id);
        const id = req.params.id;
        let service = yield Service_1.default.findByIdAndDelete({ _id: id });
        res.status(200).json({ message: "Deleted !", service });
    }
    catch (ere) {
        res.status(400).json({ message: "Failed to delete !" });
    }
});
exports.deleteService = deleteService;
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Called !");
    try {
        const { id } = req.params;
        let service = yield Service_1.default.findOne({ _id: id })
            .populate("category")
            .populate("partner");
        res.status(200).json({ message: "Find Success !", service });
    }
    catch (err) {
        res.status(400).json({ message: "Failed to find !" });
    }
});
exports.getServiceById = getServiceById;
const getServiceCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let cat = yield ServiceCategory_1.default.findOne({ _id: id });
        res.status(200).json({ message: "Find Success !", cat });
    }
    catch (err) {
        res.status(400).json({ message: "Failed to find !" });
    }
});
exports.getServiceCategoryById = getServiceCategoryById;
//-----------------------> Send confirmation mail to admin
const confirmAdminMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let admin = yield Admin_1.default.findByIdAndUpdate({ _id: id }, { mailConfirmed: true }, { new: true });
        if (admin) {
            let html = `<h3>Hello ${admin.name} </h3>
      <h4> You are now Admin !</h4>
      <h5>Sign in now ! </h5> 
      <p>Thank you</p>
      <p>Easer Team </p>
  `;
            (0, sendMail_1.sendMail)(admin.email, 'Welcome to Easer !', html);
        }
        res.send(`<h1>Mail confirmation successfully !</h1><a style="background-color: #2276a1; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 5px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href='https://easer-dashboard.vercel.app/login' >Login</a>`);
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.confirmAdminMail = confirmAdminMail;
//--------------------------->GET ALL ADMINS
const getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit } = req.query;
        let currentPage = parseInt(page) ? parseInt(page) : 1;
        let dataLimit = parseInt(limit) ? parseInt(limit) : 5;
        let skipValue = (currentPage - 1) * dataLimit;
        let admins = yield Admin_1.default.find({})
            .sort({ createdAtL: -1 })
            .skip(skipValue)
            .limit(dataLimit);
        const count = yield Admin_1.default.find({}).countDocuments();
        let allAdmins = yield Admin_1.default.find({});
        res
            .status(200)
            .json({
            message: "All Admins !",
            count,
            totalPages: Math.ceil(count / dataLimit),
            admins,
            allAdmins,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Failed to find !", err });
    }
});
exports.getAdmins = getAdmins;
//----------------------------> Delete Admin
const delteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let admin = yield Admin_1.default.findByIdAndDelete({ _id: id });
        res.status(200).json({ message: "Admin deleted Success !", admin });
    }
    catch (err) {
        res.status(400).json({ message: "Failed to delete !", err });
    }
});
exports.delteAdmin = delteAdmin;
//----------------------------> reset passsword send link to mail
const resetPasswordlink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { forgotEmail } = req.body;
        const admin = yield Admin_1.default.findOne({ email: forgotEmail });
        if (admin) {
            let message = `
      <h2>Easer password reset</h2>
      <p>We heard that you lost your Easer password. Sorry about that!</p>

      <p> But don’t worry! You can use the following link to reset your password</p>
      <a style="background-color: #1F7F4C; font-size: 18px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 14px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href=${`https://easer-dashboard.vercel.app/forgotpassword/${admin._id}`}><span style="mso-text-raise: 15pt;" >Reset your password  &rarr;</span></a>
      <p>Thanks </p>
      <p>Easer Team </p>
      `;
            console.log(req.body, admin);
            (0, sendMail_1.sendMail)(forgotEmail, 'Reset Password', message);
            res.status(200).json({ message: 'Password reset link sent !' });
        }
        else {
            res.status(400).json({ message: "Admin not found !" });
        }
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.resetPasswordlink = resetPasswordlink;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const { id } = req.params;
        let hashed_password = yield bcryptjs_1.default.hash(password, 10);
        const admin = yield Admin_1.default.findByIdAndUpdate({ _id: id }, { hashed_password: hashed_password }, { new: true });
        res.status(200).json({ message: "password reset successfully !", admin });
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.resetPassword = resetPassword;
