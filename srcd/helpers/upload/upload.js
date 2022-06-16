"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
dotenv_1.default.config();
const helpers_1 = require("../helpers");
// s3 initialization
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
});
//? uploadFile
const uploadFile = (file) => {
    //? making the return as promise
    return new Promise((resolve, reject) => {
        //Setting up s3 upload parameters
        const params = {
            Bucket: process.env.BUCKET ? process.env.BUCKET : "",
            Key: Date.now() + file.name,
            Body: file.data,
            ACL: "public-read"
        };
        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err);
                (0, helpers_1.errorBg)({ "S3 bucket error": err });
                reject(err);
            }
            let { Location } = data;
            resolve(Location);
        });
    });
};
exports.uploadFile = uploadFile;
