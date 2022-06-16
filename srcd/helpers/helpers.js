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
exports.signup = exports.login = exports.sendErrorMessage = exports.sendMessage = exports.formatDate = exports.getTimeDifference = exports.errorBg = exports.successBg = exports.error = exports.success = void 0;
const moment_1 = __importDefault(require("moment"));
//? helpers
const authHelper_1 = require("./authHelper");
const sendMail_1 = require("./sendMail/sendMail");
const success = (message) => {
    console.log("\x1b[32m", message);
};
exports.success = success;
const error = (message) => {
    console.log("\x1b[31m", message);
};
exports.error = error;
const successBg = (message) => {
    console.log("\x1b[42m", message);
};
exports.successBg = successBg;
const errorBg = (message) => {
    console.log("\x1b[41m", message);
};
exports.errorBg = errorBg;
const getTimeDifference = () => {
    var timedifference = new Date().getTimezoneOffset();
    timedifference = timedifference + timedifference - timedifference;
};
exports.getTimeDifference = getTimeDifference;
const formatDate = (date) => {
    var timedifference = new Date().getTimezoneOffset();
    //? Converting negative time difference to positive
    function convert_positive(a) {
        // Check the number is negative
        if (a < 0) {
            // Multiply number with -1
            // to make it positive
            a = a * -1;
        }
        // Return the positive number
        return a;
    }
    timedifference = convert_positive(timedifference);
    return (0, moment_1.default)(date).add(timedifference, "minutes").toISOString().slice(0, 10);
};
exports.formatDate = formatDate;
const sendMessage = (req, res, message, status) => {
    return res.status(status ? status : 200).json({ message });
};
exports.sendMessage = sendMessage;
const sendErrorMessage = (req, res, message, status) => {
    return res.status(status ? status : 400).json({ message });
};
exports.sendErrorMessage = sendErrorMessage;
const login = (Model, SubModel1, SubModel2) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        //? finding user with email
        let isExist = yield Model.findOne({ email });
        //? is user not exist with the email
        if (!isExist) {
            (0, exports.sendErrorMessage)(req, res, "User Does not Exist!", 400);
            return;
        }
        if (yield (0, authHelper_1.verifyPassword)(password, isExist.hashed_password)) {
            let token = yield (0, authHelper_1.createToken)(isExist._id);
            if (!isExist.mailConfirmed) {
                let html = `<h3>Hello </h3>
            <h4> Click on link to  !</h4>
            <a style="background-color: #1F7F4C; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 5px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href='https://easer-dev-api.applore.in/api/admin/confirmmail/${isExist._id}'>Confirm</a>
            <h5>Confirm it now ! </h5> 
            <p>Thank you</p>
            <p>Easer Team </p>
        `;
                (0, sendMail_1.sendMail)(isExist.email, 'Welcome to Easer !', html);
                res.status(201).json({ message: 'Account confirmation mail has sent to you, please confirm first !' });
            }
            return (0, exports.sendMessage)(req, res, {
                message: "Logged In Successfully!",
                data: { token },
            });
        }
        (0, exports.sendErrorMessage)(req, res, "Email/Password is Incorrect!", 400);
        return;
    }
    catch (err) {
        (0, exports.error)(err);
    }
});
exports.login = login;
const signup = (Model, SubModel1, SubModel2) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        //? finding user with email
        let isExist;
        isExist = SubModel1 && (yield SubModel1.findOne({ email }));
        //? is user already exist with the email
        if (isExist != null || isExist != undefined) {
            (0, exports.sendErrorMessage)(req, res, "Email Already Exist/Email Already in Use!", 400);
            return;
        }
        isExist = SubModel2 && (yield SubModel2.findOne({ email }));
        //? is user already exist with the email
        if (isExist != null || isExist != undefined) {
            (0, exports.sendErrorMessage)(req, res, "Email Already Exist/Email Already in Use!", 400);
            return;
        }
        isExist = yield Model.findOne({ email });
        //? is user already exist with the email
        if (isExist != null || isExist != undefined) {
            (0, exports.sendErrorMessage)(req, res, "Email Already Exist/Email Already in Use!", 400);
            return;
        }
        console.log({ isExist });
        //? Creating Hashed Password
        let hashed_password = yield (0, authHelper_1.createHashedPassword)(password);
        //? adding one new field as hashed_password
        req.body.hashed_password = hashed_password;
        //? Saving User
        let user = yield Model.create(req.body);
        let token = yield (0, authHelper_1.createToken)(user._id);
        let html = `<h3>Hello ${req.body.name}</h3>
                    <h4> Click on link to !</h4>
                    <a style="background-color: #1F7F4C; font-size: 15px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 5px 20px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;" href='https://easer-dev-api.applore.in/api/admin/confirmmail/${user._id}'>Confirm</a> 
                    <h5>Confirm it now ! </h5> 
                    <p>Thank you</p>
                    <p>Easer Team </p>
                    `;
        (0, sendMail_1.sendMail)(req.body.email, 'Welcome to Easer !', html);
        return (0, exports.sendMessage)(req, res, { message: "User Signed Up Successfully!", data: { token } }, 201);
    }
    catch (err) {
        (0, exports.error)(err);
        return (0, exports.sendErrorMessage)(req, res, err.message);
    }
});
exports.signup = signup;
