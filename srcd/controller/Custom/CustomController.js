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
exports.socialMediaLogin = exports.updateDocument = exports.deleteDocument = exports.createDocument = exports.getDocuments = exports.getDocumentById = void 0;
const lodash_1 = __importDefault(require("lodash"));
//? Helpers
const helpers_1 = require("../../helpers/helpers");
const authHelper_1 = require("../../helpers/authHelper");
//? getDocumentById
const getDocumentById = (Model) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let document = yield Model.findById(req.params.id);
        return (0, helpers_1.sendMessage)(req, res, { document });
    }
    catch (err) {
        (0, helpers_1.error)(err);
        return (0, helpers_1.sendErrorMessage)(req, res, err.message);
    }
});
exports.getDocumentById = getDocumentById;
const getDocuments = (Model) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPage = parseInt(req.query.page)
            ? parseInt(req.query.page)
            : 1;
        const limit = parseInt(req.query.limit)
            ? parseInt(req.query.limit)
            : 10;
        let skipValue = (currentPage - 1) * limit;
        let documents = yield Model.find({ deleted: false })
            .sort({ createdAt: -1 })
            .skip(skipValue)
            .limit(limit);
        let count = yield Model.find({ deleted: false }).countDocuments();
        return (0, helpers_1.sendMessage)(req, res, {
            paginate: {
                currentPage,
                limit,
                totalData: count,
                totalPage: Math.ceil(count / limit),
            },
            data: documents,
        });
    }
    catch (err) {
        (0, helpers_1.error)(err);
        return (0, helpers_1.sendErrorMessage)(req, res, err.message);
    }
});
exports.getDocuments = getDocuments;
//? createDocument
const createDocument = (Model) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield Model.create(req.body);
        (0, helpers_1.success)(result);
        return (0, helpers_1.sendMessage)(req, res, {
            message: "Document Successfully Created!",
            result,
        });
    }
    catch (err) {
        (0, helpers_1.error)(err);
        return (0, helpers_1.sendErrorMessage)(req, res, err.message);
    }
});
exports.createDocument = createDocument;
//? deleteDocument
const deleteDocument = (Model) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield Model.findOneAndUpdate({ _id: req.params.id }, { $set: { deleted: true } }, { new: true });
        if (!result && result == null) {
            return (0, helpers_1.sendErrorMessage)(req, res, "Document Not Found!");
        }
        return (0, helpers_1.sendMessage)(req, res, {
            message: "Document Successfully Deleted!",
            result,
        });
    }
    catch (err) {
        (0, helpers_1.error)(err);
        return (0, helpers_1.sendErrorMessage)(req, res, err.message);
    }
});
exports.deleteDocument = deleteDocument;
//? updateDocument
const updateDocument = (Model) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let document = yield Model.findById(req.params.id);
        if (!document && document == null) {
            return (0, helpers_1.sendErrorMessage)(req, res, "Document Not Found!");
        }
        let updatedDocument = lodash_1.default.extend(document, req.body);
        let result = yield Model.findOneAndUpdate({ _id: document === null || document === void 0 ? void 0 : document._id }, { $set: updatedDocument }, { new: true });
        return (0, helpers_1.sendMessage)(req, res, {
            message: "Document Successfully Updated!",
            result,
        });
    }
    catch (err) {
        (0, helpers_1.error)(err);
        return (0, helpers_1.sendErrorMessage)(req, res, err.message);
    }
});
exports.updateDocument = updateDocument;
const socialMediaLogin = (Model, SubModel1, SubModel2) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email } = req.body;
        let isExist = undefined;
        isExist = yield Model.findOne({ email });
        isExist = SubModel1 && (yield SubModel1.findOne({ email }));
        isExist = SubModel2 && (yield SubModel2.findOne({ email }));
        //? is user already exist with the email then login
        if (isExist != null || isExist != undefined) {
            let token = yield (0, authHelper_1.createToken)(isExist._id);
            return (0, helpers_1.sendMessage)(req, res, {
                data: { message: "Logged In Successfully!", token, user: isExist },
            });
        }
        //? if user is not available in any model then we will create that user
        let user = yield Model.create(req.body);
        let token = yield (0, authHelper_1.createToken)(user._id);
        return (0, helpers_1.sendMessage)(req, res, {
            data: { message: "Logged In Successfully!", token, user },
        });
    }
    catch (err) {
        (0, helpers_1.error)(err);
        return (0, helpers_1.sendErrorMessage)(req, res, err.message);
    }
});
exports.socialMediaLogin = socialMediaLogin;
