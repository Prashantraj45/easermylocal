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
exports.getPartnerById = exports.partnerServices = exports.deletePartner = exports.updatePartner = exports.approvePartner = exports.getRequestedPartners = exports.getPartners = exports.createPartner = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const path_1 = require("path");
const Partner_1 = __importDefault(require("../models/Partner"));
const authHelper_1 = require("../helpers/authHelper");
const Service_1 = __importDefault(require("../models/Service"));
const sendMail_1 = require("../helpers/sendMail/sendMail");
const PartnerDocument_1 = __importDefault(require("../models/PartnerDocument"));
const createPartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { name, email, password, phone, address, commission, rating, image, charges, service, passport, drivingLicense, citizenCard, biometricResidencePermit, nationalIdentityCard, } = req.body;
        const encrypt_password = yield bcryptjs_1.default.hash(password, 10);
        (0, path_1.resolve)(encrypt_password);
        const doc = yield PartnerDocument_1.default.create({
            passport,
            drivingLicense,
            citizenCard,
            biometricResidencePermit,
            nationalIdentityCard,
        });
        const partner = yield Partner_1.default.create({
            name,
            email,
            hashed_password: encrypt_password,
            image: image,
            charges: charges,
            phone: phone,
            address: address,
            commission: commission,
            rating: rating,
            service: service,
            documents: doc._id,
        });
        const updatePartner = yield PartnerDocument_1.default.findByIdAndUpdate({ _id: doc._id }, { partner: partner._id });
        console.log(updatePartner);
        let message = `
                  <h1>Hi, ${name}</h1>
                  <h3>You are now Parner !</h3>
                  <h4> Sign in Now !</h4>
                  `;
        (0, sendMail_1.sendMail)(req.body.email, "Easer Registration", message);
        let token = yield (0, authHelper_1.createToken)(partner._id);
        yield Partner_1.default.findByIdAndUpdate({ _id: partner._id }, { userToken: token });
        res.status(200).json({ message: "Success !", partner });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.createPartner = createPartner;
const getPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit } = req.query;
        let currentPage = parseInt(page);
        let dataLimit = parseInt(limit);
        let skipValue = (currentPage - 1) * dataLimit;
        const allPartners = yield Partner_1.default.find({ verified: true });
        const partners = yield Partner_1.default.find({ verified: true })
            .skip(skipValue)
            .limit(dataLimit)
            .populate("service")
            .populate("documents")
            .sort({ createdAt: -1 });
        let count = yield Partner_1.default.find({}).countDocuments();
        let totalPages = Math.ceil(count / dataLimit);
        res
            .status(200)
            .json({
            message: "Success !",
            count,
            totalPages,
            page,
            partners,
            allPartners,
        });
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong !" });
    }
});
exports.getPartners = getPartners;
const getRequestedPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit } = req.query;
        let currentPage = parseInt(page);
        let dataLimit = parseInt(limit);
        let skipValue = (currentPage - 1) * dataLimit;
        const allPartners = yield Partner_1.default.find({ verified: false });
        const partners = yield Partner_1.default.find({ verified: false })
            .skip(skipValue)
            .limit(dataLimit)
            .populate("service")
            .populate("documents")
            .sort({ createdAt: -1 });
        let count = yield Partner_1.default.find({}).countDocuments();
        let totalPages = Math.ceil(count / dataLimit);
        res
            .status(200)
            .json({
            message: "Success !",
            count,
            totalPages,
            page,
            partners,
            allPartners,
        });
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong !" });
    }
});
exports.getRequestedPartners = getRequestedPartners;
const approvePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { verified } = req.body;
        const partner = yield Partner_1.default.findByIdAndUpdate({ _id: id }, { verified: verified });
        res.status(200).json({ message: " Update Success !", partner });
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.approvePartner = approvePartner;
///Approve api for admin to for partner verification
const updatePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // const updatePartner = await Partner.findOne({_id:id})
        // if(!(updatePartner.service == req.body.service)){
        //     await Service.findByIdAndUpdate({_id:updatePartner.service},{partner:null})
        // }
        const { name, email, phone, address, commission, rating, image, charges, service, verified, passport, drivingLicense, citizenCard, biometricResidencePermit, nationalIdentityCard, } = req.body;
        const doc = yield PartnerDocument_1.default.updateOne({ partner: id }, {
            passport,
            drivingLicense,
            citizenCard,
            biometricResidencePermit,
            nationalIdentityCard,
        });
        const partner = yield Partner_1.default.findByIdAndUpdate({ _id: id }, {
            name: name,
            email: email,
            image: image,
            charges: charges,
            phone: phone,
            address: address,
            commission: commission,
            rating: rating,
            service: service,
            verified: verified,
        });
        yield Service_1.default.findByIdAndUpdate({ _id: service }, { partner: id });
        res.status(200).json({ message: " Update Success !", partner });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.updatePartner = updatePartner;
const deletePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Partner_1.default.findByIdAndDelete({ _id: id });
        res.status(200).json({ message: "Deleted Success !" });
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.deletePartner = deletePartner;
const partnerServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let services = yield Service_1.default.find({ partner: id });
        res.status(200).json({ message: "Partner services !", services });
    }
    catch (err) {
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.partnerServices = partnerServices;
// GET PARTNER BY ID
const getPartnerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    try {
        let partner = yield Partner_1.default.findOne({ _id: id }).populate("documents");
        res.status(200).json({ message: "Partner !", partner });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Something went wrong !", err });
    }
});
exports.getPartnerById = getPartnerById;
