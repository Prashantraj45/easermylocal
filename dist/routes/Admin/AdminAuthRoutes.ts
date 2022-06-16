import express from "express";
let router = express.Router();

//? Helpers
import { check } from "express-validator";
import { login, signup } from "../../helpers/helpers";
import { validate } from "../../helpers/validator/validator";

//? Models
import Admin from "../../models/Admin";
import Partner from "../../models/Partner";
import User from "../../models/User";

//? POST
router.post(
  "/signup",
  //? For Validating Incoming Body Fields
  validate([
    check("email")
      .not()
      .isEmpty()
      .withMessage("email is required!")
      .isEmail()
      .withMessage("email is not valid!"),
    check("password").not().isEmpty().withMessage("password is required!"),
  ]),
  signup(Admin, Partner, User)
);

router.post(
  "/login",
  //? For Validating Incoming Body Fields
  validate([
    check("email")
      .not()
      .isEmpty()
      .withMessage("email is required!")
      .isEmail()
      .withMessage("email is not valid!"),
    check("password").not().isEmpty().withMessage("password is required!"),
  ]),
  login(Admin)
);

export default router;
