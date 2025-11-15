import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const validationHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
      throw errorValidation.array();
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const createPenugasanValidation = [
  body("guruId")
    .notEmpty()
    .withMessage("guruId wajib diisi")
    .isUUID()
    .withMessage("Format guruId tidak valid"),
  body("mapelId")
    .notEmpty()
    .withMessage("mapelId wajib diisi")
    .isUUID()
    .withMessage("Format mapelId tidak valid"),
  body("kelasId")
    .notEmpty()
    .withMessage("kelasId wajib diisi")
    .isUUID()
    .withMessage("Format kelasId tidak valid"),
  validationHandler,
];