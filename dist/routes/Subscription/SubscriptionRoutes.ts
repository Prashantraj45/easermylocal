import express from "express";
const router = express.Router();
import { check } from "express-validator";

//? Helpers
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlans,
  updateSubscriptionPlan,
  getSubscriptionPlan,
  purchaseSubscription,
  createCustomer,
  saveCard,
  getCustomers,
  getCustomerPaymentMethods,
} from "../../controller/SubscriptionController";

//? Middlewares
import { validate } from "../../helpers/validator/validator";
import { checkTokenAndPermission } from "../../middleware/middlewares";

//? GET
router.get("/", getSubscriptionPlans);

router.get("/:productId/:priceId", getSubscriptionPlan);

router.get("/get/customers", getCustomers);

router.get(
  "/customer/cards",
  checkTokenAndPermission(["ADMIN", "USER"]),
  validate([
    check("customer").not().isEmpty().withMessage("customer is required!"),
  ]),
  getCustomerPaymentMethods
);

//? POST
router.post(
  "/",
  checkTokenAndPermission(["ADMIN"]),
  validate([
    check("name").not().isEmpty().withMessage("name is required!"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("description is required!"),
    check("unit_amount")
      .not()
      .isEmpty()
      .withMessage("unit_amount is required!"),
    check("currency").not().isEmpty().withMessage("currency is required!"),
  ]),
  createSubscriptionPlan
);

router.post(
  "/purchase",
  validate([
    check("customer").not().isEmpty().withMessage("customer is required!"),
    check("price").not().isEmpty().withMessage("price is required!"),
  ]),
  purchaseSubscription
);

router.post(
  "/customer",
  validate([
    check("name").not().isEmpty().withMessage("name is required!"),
    check("phone").not().isEmpty().withMessage("phone is required!"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("email is required!")
      .isEmail()
      .withMessage("email is invalid!"),
  ]),
  createCustomer
);

router.post(
  "/card",
  validate([
    check("number").not().isEmpty().withMessage("number is required!"),
    check("exp_month").not().isEmpty().withMessage("exp_month is required!"),
    check("exp_year").not().isEmpty().withMessage("exp_year is required!"),
    check("cvc").not().isEmpty().withMessage("cvc is required!"),
  ]),
  saveCard
);

//? PUT
router.put("/:productId/:priceId", updateSubscriptionPlan);

//? DELETE
router.delete("/:id", deleteSubscriptionPlan);

export default router;
