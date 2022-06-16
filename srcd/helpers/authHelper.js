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
exports.createToken = exports.verifyPassword = exports.createHashedPassword = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const helpers_1 = require("./helpers");
const createHashedPassword = (data) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let hashed_password = yield bcryptjs_1.default.hash(data, 10);
            resolve(hashed_password);
        }
        catch (err) {
            (0, helpers_1.errorBg)(err);
            reject(err);
        }
    }));
};
exports.createHashedPassword = createHashedPassword;
const verifyPassword = (password, hashed_password) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let isPasswordValid = yield bcryptjs_1.default.compare(password, hashed_password);
            (0, helpers_1.success)({ isPasswordValid });
            resolve(isPasswordValid);
        }
        catch (err) {
            (0, helpers_1.errorBg)({ err });
            reject(err);
        }
    }));
};
exports.verifyPassword = verifyPassword;
const createToken = (_id) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ _id }, process.env.SECRET ? process.env.SECRET : "", (err, token) => {
            if (err) {
                (0, helpers_1.errorBg)({ err });
                reject(err);
            }
            resolve(token);
        });
    });
};
exports.createToken = createToken;
