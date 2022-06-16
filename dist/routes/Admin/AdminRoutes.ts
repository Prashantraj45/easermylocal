import express from "express";
let router = express.Router();
import { check } from "express-validator";

//? Models
import Subscription from "../../models/Subscription";
import ServiceCategory from "../../models/ServiceCategory";
import Service from "../../models/Service";

//? Helpers
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "../../controller/Custom/CustomController";
import { validate } from "../../helpers/validator/validator";
import { checkTokenAndPermission } from "../../middleware/middlewares";
import {getServices, deleteService, getServiceById, getServiceCategoryById, getAdmins, delteAdmin, resetPasswordlink, resetPassword, confirmAdminMail} from '../../controller/AdminController'
import { partnerServices } from "../../controller/Partner/PartnerController";


//GET Admins

router.get('/confirmmail/:id', confirmAdminMail )

router.get('/',checkTokenAndPermission(["Admin"]),getAdmins)

router.delete('/:id',checkTokenAndPermission(['ADMIN']),delteAdmin)
//---------->send mail for password reset
router.post('/resetpasswordlink', resetPasswordlink)
//-----------------> reset password
router.post('/resetpassword/:id',resetPassword)


//? GET
router.get(
  "/service/category",
  checkTokenAndPermission(["ADMIN", "PARTNER", "USER"]),
  getDocuments(ServiceCategory)
);

// router.get("/subscription", getDocuments(Subscription));

router.get(
  "/service",
  checkTokenAndPermission(["ADMIN", "PARTNER", "USER"]),
  getServices
);

router.get('/service/:id',checkTokenAndPermission(['ADMIN', 'PARTNER', 'USER']),getServiceById)

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

router.post(
  "/service/category",
  checkTokenAndPermission(["ADMIN"]),
  validate([
    check("name").not().isEmpty().withMessage("name is required!"),
    check("image").not().isEmpty().withMessage("imageUrl name is required!"),
  ]),createDocument(ServiceCategory)
);

router.post(
  "/service",
  checkTokenAndPermission(["ADMIN"]),
  validate([
    check("name").not().isEmpty().withMessage("name is required!"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("description is required!"),
    check("category").not().isEmpty().withMessage("category name is required!"),
    check("image").not().isEmpty().withMessage("imageUrl name is required!"),
  ]),
  createDocument(Service)
);

//? PUT
// router.put("/subscription/:id", updateDocument(Subscription));


router.get("/service/category/:id",checkTokenAndPermission(["ADMIN"]),getServiceCategoryById)
router.put(
  "/service/category/:id",
  checkTokenAndPermission(["ADMIN"]),
  updateDocument(ServiceCategory)
);

router.put(
  "/service/:id",
  checkTokenAndPermission(["ADMIN"]),
  updateDocument(Service)
);

//? DELETE
// router.delete("/subscription/:id", deleteDocument(Subscription));

router.delete(
  "/service/category/:id",
  checkTokenAndPermission(["ADMIN"]),
  deleteDocument(ServiceCategory)
);

router.delete(
  "/service/:id",
  checkTokenAndPermission(["ADMIN"]),
  deleteService
);

router.get(
  "/services/:id",
  checkTokenAndPermission(['ADMIN']),
  partnerServices
)

export default router;
