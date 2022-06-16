import { Request, Response } from "express";
import mongoose from "mongoose";
import lodash from "lodash";

//? Helpers
import {
  error,
  sendErrorMessage,
  sendMessage,
  success,
} from "../../helpers/helpers";
import { createToken } from "../../helpers/authHelper";

//? getDocumentById
export const getDocumentById =
  (Model: mongoose.Model<mongoose.Document>) =>
  async (req: Request, res: Response) => {
    try {
      let document = await Model.findById(req.params.id);

      return sendMessage(req, res, { document });
    } catch (err: any) {
      error(err);
      return sendErrorMessage(req, res, err.message);
    }
  };

export const getDocuments =
  (Model: mongoose.Model<mongoose.Document>) =>
  async (req: Request, res: Response) => {
    try {
      const currentPage = parseInt(req.query.page as string)
        ? parseInt(req.query.page as string)
        : 1;
      const limit = parseInt(req.query.limit as string)
        ? parseInt(req.query.limit as string)
        : 10;

      let skipValue = (currentPage - 1) * limit;

      let documents = await Model.find({deleted:false})
        .sort({ createdAt: -1 })
        .skip(skipValue)
        .limit(limit);

      let count = await Model.find({deleted:false}).countDocuments();

      return sendMessage(req, res, {
        paginate: {
          currentPage,
          limit,
          totalData: count,
          totalPage: Math.ceil(count / limit),
        },
        data: documents,
      });
    } catch (err: any) {
      error(err);
      return sendErrorMessage(req, res, err.message);
    }
  };

//? createDocument
export const createDocument =
  (Model: mongoose.Model<mongoose.Document>) =>
  async (req: Request, res: Response) => {
    try {
      let result = await Model.create(req.body);
      success(result);
      return sendMessage(req, res, {
        message: "Document Successfully Created!",
        result,
      });
    } catch (err: any) {
      error(err);
      return sendErrorMessage(req, res, err.message);
    }
  };

//? deleteDocument
export const deleteDocument =
  (Model: mongoose.Model<mongoose.Document>) =>
  async (req: Request, res: Response) => {
    try {
      let result = await Model.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { deleted: true } },
        { new: true }
      );

      if (!result && result == null) {
        return sendErrorMessage(req, res, "Document Not Found!");
      }

      return sendMessage(req, res, {
        message: "Document Successfully Deleted!",
        result,
      });
    } catch (err: any) {
      error(err);
      return sendErrorMessage(req, res, err.message);
    }
  };

//? updateDocument
export const updateDocument =
  (Model: mongoose.Model<mongoose.Document>) =>
  async (req: Request, res: Response) => {
    try {
      let document = await Model.findById(req.params.id);

      if (!document && document == null) {
        return sendErrorMessage(req, res, "Document Not Found!");
      }

      let updatedDocument = lodash.extend(document, req.body);

      let result = await Model.findOneAndUpdate(
        { _id: document?._id },
        { $set: updatedDocument },
        { new: true }
      );

      return sendMessage(req, res, {
        message: "Document Successfully Updated!",
        result,
      });
    } catch (err: any) {
      error(err);
      return sendErrorMessage(req, res, err.message);
    }
  };

export const socialMediaLogin =
  (
    Model: mongoose.Model<mongoose.Document>,
    SubModel1: mongoose.Model<mongoose.Document>,
    SubModel2: mongoose.Model<mongoose.Document>
  ) =>
  async (req: Request, res: Response) => {
    try {
      let { email } = req.body;

      let isExist = undefined;
      isExist =await Model.findOne({ email });
      isExist = SubModel1 && (await SubModel1.findOne({ email }));
      isExist = SubModel2 && (await SubModel2.findOne({ email }));

      //? is user already exist with the email then login
      if (isExist != null || isExist != undefined) {
        let token = await createToken(isExist._id);

        return sendMessage(req, res, {
          data: { message: "Logged In Successfully!", token, user: isExist },
        });
      }

      //? if user is not available in any model then we will create that user
      let user = await Model.create(req.body);
      let token = await createToken(user._id);

      return sendMessage(req, res, {
        data: { message: "Logged In Successfully!", token, user },
      });
    } catch (err: any) {
      error(err);
      return sendErrorMessage(req, res, err.message);
    }
  };
