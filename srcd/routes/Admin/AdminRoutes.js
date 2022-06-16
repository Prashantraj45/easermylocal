"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const ServiceCategory_1 = __importDefault(require("../../models/ServiceCategory"));
const Service_1 = __importDefault(require("../../models/Service"));
//? Helpers
const CustomController_1 = require("../../controller/Custom/CustomController");
const validator_1 = require("../../helpers/validator/validator");
const middlewares_1 = require("../../middleware/middlewares");
const AdminController_1 = require("../../controller/AdminController");
const PartnerController_1 = require("../../controller/Partner/PartnerController");
//GET Admins
router.get('/confirmmail/:id', AdminController_1.confirmAdminMail);
router.get('/', (0, middlewares_1.checkTokenAndPermission)(["Admin"]), AdminController_1.getAdmins);
router.delete('/:id', (0, middlewares_1.checkTokenAndPermission)(['ADMIN']), AdminController_1.delteAdmin);
//---------->send mail for password reset
router.post('/resetpasswordlink', AdminController_1.resetPasswordlink);
//-----------------> reset password
router.post('/resetpassword/:id', AdminController_1.resetPassword);
//? GET
router.get("/service/category", (0, middlewares_1.checkTokenAndPermission)(["ADMIN", "PARTNER", "USER"]), (0, CustomController_1.getDocuments)(ServiceCategory_1.default));
// router.get("/subscription", getDocuments(Subscription));
router.get("/service", (0, middlewares_1.checkTokenAndPermission)(["ADMIN", "PARTNER", "USER"]), AdminController_1.getServices);
router.get('/service/:id', (0, middlewares_1.checkTokenAndPermission)(['ADMIN', 'PARTNER', 'USER']), AdminController_1.getServiceById);
//? POST
// router.post(
//   "/subscription",
//   checkTokenAndPermission(["ADMIN"]),
//   validate([
//     check("name").not().isEmpty().withMessage("subscription name is required!"),
//     check("description")
//       .not()
//       .isEmpty()
//       .withMessage("description is required!"),
//     check("amount").not().isEmpty().withMessage("amount is required!"),
//     check("duration").not().isEmpty().withMessage("duration is required!"),
//   ]),
//   createDocument(Subscription)
// );
router.post("/service/category", (0, middlewares_1.checkTokenAndPermission)(["ADMIN"]), (0, validator_1.validate)([
    (0, express_validator_1.check)("name").not().isEmpty().withMessage("name is required!"),
    (0, express_validator_1.check)("image").not().isEmpty().withMessage("imageUrl name is required!"),
]), (0, CustomController_1.createDocument)(ServiceCategory_1.default));
router.post("/service", (0, middlewares_1.checkTokenAndPermission)(["ADMIN"]), (0, validator_1.validate)([
    (0, express_validator_1.check)("name").not().isEmpty().withMessage("name is required!"),
    (0, express_validator_1.check)("description")
        .not()
        .isEmpty()
        .withMessage("description is required!"),
    (0, express_validator_1.check)("category").not().isEmpty().withMessage("category name is required!"),
    (0, express_validator_1.check)("image").not().isEmpty().withMessage("imageUrl name is required!"),
]), (0, CustomController_1.createDocument)(Service_1.default));
//? PUT
// router.put("/subscription/:id", updateDocument(Subscription));
router.get("/service/category/:id", (0, middlewares_1.checkTokenAndPermission)(["ADMIN"]), AdminController_1.getServiceCategoryById);
router.put("/service/category/:id", (0, middlewares_1.checkTokenAndPermission)(["ADMIN"]), (0, CustomController_1.updateDocument)(ServiceCategory_1.default));
router.put("/service/:id", (0, middlewares_1.checkTokenAndPermission)(["ADMIN"]), (0, CustomController_1.updateDocument)(Service_1.default));
//? DELETE
// router.delete("/subscription/:id", deleteDocument(Subscription));
router.delete("/service/category/:id", (0, middlewares_1.checkTokenAndPermission)(["ADMIN"]), (0, CustomController_1.deleteDocument)(ServiceCategory_1.default));
router.delete("/service/:id", (0, middlewares_1.checkTokenAndPermission)(["ADMIN"]), AdminController_1.deleteService);
router.get("/services/:id", (0, middlewares_1.checkTokenAndPermission)(['ADMIN']), PartnerController_1.partnerServices);
exports.default = router;
