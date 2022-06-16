import express from "express";
let router = express.Router();
import { check } from "express-validator";


//?  Helpers
import { socialMediaLogin } from "../../controller/Custom/CustomController";

//? Models
import Partner from "../../models/Partner";
import Admin from "../../models/Admin";
import User from "../../models/User";
import { getSetPassword, resetPassword, setPassword, userLogin } from "../../controller/UserController/UserAuthController";
import { validate } from "../../helpers/validator/validator";
import { createUser } from "../../controller/UserController/UserController";

//? POST
router.post("/media/login", socialMediaLogin(User, Partner, Admin));

//? Login
router.post('/login',userLogin)
router.post('/forgotpassword',resetPassword)
router.get('/setpassword/:id/:token',getSetPassword)
router.post('/setpassword/:id/:token',setPassword)

//Sign up
router.post(
    "/",
    validate([check("name").not().isEmpty().withMessage("name is required!"),check('email').not().isEmpty().withMessage('email is required !')]),
    createUser
  );

export default router;
