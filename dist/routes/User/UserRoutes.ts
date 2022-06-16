import express from "express";
let router = express.Router();
import { check } from "express-validator";

//? Helpers
import {
  getDocumentById,
  getDocuments,
} from "../../controller/Custom/CustomController";

//? Middlewares
import {
  checkTokenAndPermission,
  checkViewCountAndLeads,
} from "../../middleware/middlewares";

//? Models
import Partner from "../../models/Partner";
import User from "../../models/User";

import { createUser, getUsers, deleteUser, updateUser, getUserById, userReferrals, getReferralById } from "../../controller/UserController/UserController";
import { validate } from "../../helpers/validator/validator";

//? GET
router.get(
  "/",
  checkTokenAndPermission(["PARTNER", "USER", "ADMIN"]),
  checkViewCountAndLeads,
  getUsers
);

// router.get(
//   "/:id",
//   checkTokenAndPermission(["PARTNER", "USER", "ADMIN"]),
//   checkViewCountAndLeads,
//   getDocumentById(User)
// );

//? POST

//? UPDATE

router.put('/:id',checkTokenAndPermission(["ADMIN"]),updateUser)

//? DELETE

router.delete('/:id',checkTokenAndPermission(['ADMIN']),deleteUser)

//? Get user by id
router.get('/:id',checkTokenAndPermission(["ADMIN","PARTNER"]),checkViewCountAndLeads,getUserById)

router.get('/user/referral',checkTokenAndPermission(["ADMIN"]),userReferrals)
router.get('/user/referral/:id',checkTokenAndPermission(["ADMIN"]),getReferralById)

export default router;
