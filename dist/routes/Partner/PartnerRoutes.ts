import express from "express";
let router = express.Router();

//? Helpers

//? Middlewares
import {
  checkTokenAndPermission,
  checkViewCountAndLeads
} from "../../middleware/middlewares";

//? Models

//Controller
import { addReview, approvePartner, createPartner, deletePartner, deleteReview, getPartnerById, getPartners, getRequestedPartners, partnerLogin, searchPartners, updatePartner } from '../../controller/Partner/PartnerController';

//? GET ALL PARTNER
router.get(
  "/",
  checkTokenAndPermission(["PARTNER", "USER", "ADMIN"]),
  checkViewCountAndLeads,
  getPartners
);

//? GET ALL REQUESTED PARTNER
router.get(
  "/requests",
  checkTokenAndPermission(["PARTNER", "USER", "ADMIN"]),
  checkViewCountAndLeads,
  getRequestedPartners
);

//GET Single Partner

router.get(
  "/:id",
  checkTokenAndPermission(["PARTNER", "USER", "ADMIN"]),
  checkViewCountAndLeads,
  getPartnerById
);

//? POST
router.post('/', createPartner)

//Login
router.post('/login', partnerLogin)

//APPROVE partner
router.put('/approve/:id', checkTokenAndPermission(['ADMIN']), approvePartner)


//? UPDATE

router.put('/update/:id', checkTokenAndPermission(["ADMIN"]), updatePartner)



//? DELETE

router.delete('/:id', checkTokenAndPermission(["ADMIN"]), deletePartner)

//----------------> Add review of a partner
router.post('/review/add', checkTokenAndPermission(["ADMIN", "USER"]), addReview)

//----------------> Delete review of a partner
router.delete('/review/delete', checkTokenAndPermission(["ADMIN", "USER"]), deleteReview)

//-------------------> Search API
router.get('/search/partner', searchPartners)

export default router;
