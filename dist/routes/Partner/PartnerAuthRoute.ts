import express from "express";
let router = express.Router();

//?  Helpers
import { socialMediaLogin } from "../../controller/Custom/CustomController";

//? Models
import Partner from "../../models/Partner";
import Admin from "../../models/Admin";
import User from "../../models/User";
import { resetPassword, getSetPassword, setPassword } from "../../controller/Partner/PartnerAuthController";

//? POST
router.post("/media/login", socialMediaLogin(Partner, User, Admin));


router.post('/forgotpassword',resetPassword)
router.get('/setpassword/:id/:token',getSetPassword)
router.post('/setpassword/:id/:token',setPassword)

export default router;
