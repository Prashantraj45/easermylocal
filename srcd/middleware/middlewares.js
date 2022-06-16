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
exports.checkViewCountAndLeads = exports.checkTokenAndPermission = exports.checkGuestAccess = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//? helpers
const helpers_1 = require("../helpers/helpers");
//? Models
const Admin_1 = __importDefault(require("../models/Admin"));
const Partner_1 = __importDefault(require("../models/Partner"));
const User_1 = __importDefault(require("../models/User"));
const getUser = (user) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let userData = (yield Admin_1.default.findById({ _id: user._id })) ||
                (yield Partner_1.default.findById({ _id: user._id })) ||
                (yield User_1.default.findById({ _id: user._id }));
            resolve(userData);
        }
        catch (err) {
            (0, helpers_1.error)(err);
            reject(err);
        }
    }));
};
const checkGuestAccess = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const auth = { username: process.env.BASIC_AUTH_USERNAME, password: process.env.BASIC_AUTH_PASSWORD };
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        if (username && password && username === auth.username && password === auth.password) {
            return next();
        }
        res.status(401).json({ error: "Unauthorized Request" });
    });
};
exports.checkGuestAccess = checkGuestAccess;
const checkTokenAndPermission = (permission) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let token = (req.headers.authorization && req.headers.authorization) ||
            (req.headers.authorization &&
                ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization.split("Bearer")[1]));
        console.log("token", token);
        console.log({ permission });
        permission = permission.map(x => x.toUpperCase());
        //? Checking whether token is null or not
        if (!token || token == null) {
            return res
                .status(400)
                .json({ error: true, message: "Unauthorized Request!" });
        }
        if (token.startsWith("Bearer ")) {
            //? Removing Bearer from token string
            token = token.slice(7, token.length).trimLeft();
        }
        if (!token) {
            return res.status(401).json({ error: true, message: "Invalid Token!" });
        }
        let user = yield jsonwebtoken_1.default.verify(token, process.env.SECRET ? process.env.SECRET : "");
        console.log("user", user);
        let userData = yield getUser(user);
        console.log("userData", userData);
        if (!userData || userData == null) {
            return res
                .status(400)
                .json({ error: true, message: "User Not Found!" });
        }
        console.log({ permission });
        console.log("permission include", permission.includes(userData.userType));
        if (!permission.includes((_b = userData === null || userData === void 0 ? void 0 : userData.userType) === null || _b === void 0 ? void 0 : _b.toUpperCase())) {
            return res
                .status(400)
                .json({ error: true, message: "You Don't Have Enough Permission!" });
        }
        req.user = userData;
        next();
    }
    catch (err) {
        (0, helpers_1.error)(err);
    }
});
exports.checkTokenAndPermission = checkTokenAndPermission;
//? For Checking And
const checkViewCountAndLeads = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userType, viewCount, leadCount, isPremium } = req.user;
        //? if there will be no userType
        if ((userType && userType == null) || userType == undefined) {
            return (0, helpers_1.sendMessage)(req, res, "No User Type in req.user...");
        }
        console.log('--------------------------------------------------->', req.user);
        //? if the incoming user is of type user
        if (userType == "USER") {
            //? checking user count
            if (viewCount == 0 && !isPremium) {
                return (0, helpers_1.sendMessage)(req, res, "No Count Left to View Partner Profile!");
            }
            if (isPremium) {
                next();
                return;
            }
            //? substracting 1 viewCount
            yield User_1.default.findByIdAndUpdate({ _id: req.user._id }, { $inc: { viewCount: -1 } });
            next();
            return;
        }
        //? if the incoming user is of type partner
        if (userType == "PARTNER") {
            //? checking user count
            if (leadCount == 0 && !isPremium) {
                return (0, helpers_1.sendMessage)(req, res, "No Lead Count Left!");
            }
            if (isPremium) {
                next();
                return;
            }
            //? substracting 1 leadCount if user is not premium
            yield Partner_1.default.findByIdAndUpdate({ _id: req.user._id }, { $inc: { leadCount: -1 } });
            next();
        }
        if (userType == "ADMIN") {
            next();
            return;
        }
        // next();
    }
    catch (err) {
        (0, helpers_1.error)(err);
        return (0, helpers_1.sendErrorMessage)(req, res, err.message);
    }
});
exports.checkViewCountAndLeads = checkViewCountAndLeads;
