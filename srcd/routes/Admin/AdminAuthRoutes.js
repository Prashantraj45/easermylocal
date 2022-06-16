"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
//? Helpers
const express_validator_1 = require("express-validator");
const helpers_1 = require("../../helpers/helpers");
const validator_1 = require("../../helpers/validator/validator");
//? Models
const Admin_1 = __importDefault(require("../../models/Admin"));
const Partner_1 = __importDefault(require("../../models/Partner"));
const User_1 = __importDefault(require("../../models/User"));
//? POST
router.post("/signup", 
//? For Validating Incoming Body Fields
(0, validator_1.validate)([
    (0, express_validator_1.check)("email")
        .not()
        .isEmpty()
        .withMessage("email is required!")
        .isEmail()
        .withMessage("email is not valid!"),
    (0, express_validator_1.check)("password").not().isEmpty().withMessage("password is required!"),
]), (0, helpers_1.signup)(Admin_1.default, Partner_1.default, User_1.default));
router.post("/login", 
//? For Validating Incoming Body Fields
(0, validator_1.validate)([
    (0, express_validator_1.check)("email")
        .not()
        .isEmpty()
        .withMessage("email is required!")
        .isEmail()
        .withMessage("email is not valid!"),
    (0, express_validator_1.check)("password").not().isEmpty().withMessage("password is required!"),
]), (0, helpers_1.login)(Admin_1.default));
exports.default = router;
