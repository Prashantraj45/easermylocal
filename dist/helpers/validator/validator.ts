import { NextFunction, Request, Response } from "express";

const express = require("express");
const { validationResult } = require("express-validator");
// can be reused by many routes

// parallel processing
const validate =
  (validations: any[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array()[0].msg });
  };

export { validate };
