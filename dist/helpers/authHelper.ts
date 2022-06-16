import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";
import { Request, Response } from "express";

dotenv.config();

import { errorBg, success } from "./helpers";

export const createHashedPassword = (data: string): any => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashed_password = await bcryptjs.hash(data, 10);
      resolve(hashed_password);
    } catch (err: any) {
      errorBg(err);
      reject(err);
    }
  });
};

export const verifyPassword = (password: string, hashed_password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isPasswordValid = await bcryptjs.compare(password, hashed_password);
      success({ isPasswordValid });
      resolve(isPasswordValid);
    } catch (err) {
      errorBg({ err });
      reject(err);
    }
  });
};

export const createToken = (_id: string) => {
  return new Promise((resolve, reject) => {
    Jwt.sign(
      { _id },
      process.env.SECRET ? process.env.SECRET : "",
      (err: any, token: any) => {
        if (err) {
          errorBg({ err });
          reject(err);
        }
        resolve(token);
      }
    );
  });
};
