"use strict";
// import express from "express";
// import { check } from "express-validator";
// let router = express.Router();
// //? Models
// import Subscription from "../../models/Subscription";
// import ServiceCategory from "../../models/ServiceCategory";
// import Service from "../../models/Service";
// //? Helpers
// import {
//   createDocument,
//   deleteDocument,
//   getDocuments,
//   updateDocument,
// } from "../../controller/Custom/CustomController";
// import { validate } from "../../helpers/validator/validator";
// //? GET
// router.get("/service/category", getDocuments(ServiceCategory));
// router.get("/subscription", getDocuments(Subscription));
// router.get("/service", getDocuments(Service));
// //? POST
// router.post(
//   "/subscription",
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
// router.post(
//   "/service/category",
//   validate([
//     check("name").not().isEmpty().withMessage("subscription name is required!"),
//     check("image").not().isEmpty().withMessage("imageUrl name is required!"),
//   ]),
//   createDocument(ServiceCategory)
// );
// router.post(
//   "/service",
//   validate([
//     check("name").not().isEmpty().withMessage("name is required!"),
//     check("category").not().isEmpty().withMessage("category name is required!"),
//     check("partner").not().isEmpty().withMessage("partner name is required!"),
//     check("image").not().isEmpty().withMessage("imageUrl name is required!"),
//   ]),
//   createDocument(Service)
// );
// //? PUT
// router.put("/subscription/:id", updateDocument(Subscription));
// router.put("/service/category/:id", updateDocument(ServiceCategory));
// router.put("/service/:id", updateDocument(Service));
// //? DELETE
// router.delete("/subscription/:id", deleteDocument(Subscription));
// router.delete("/service/category/:id", deleteDocument(ServiceCategory));
// export default router;
