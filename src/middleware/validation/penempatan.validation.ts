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

export const createPenempatanValidation = [
  body("siswaId")
    .notEmpty()
    .withMessage("siswaId wajib diisi")
    .isUUID()
    .withMessage("Format siswaId tidak valid"),
  body("kelasId")
    .notEmpty()
    .withMessage("kelasId wajib diisi")
    .isUUID()
    .withMessage("Format kelasId tidak valid"),
  body("tahunAjaranId")
    .notEmpty()
    .withMessage("tahunAjaranId wajib diisi")
    .isUUID()
    .withMessage("Format tahunAjaranId tidak valid"),
  validationHandler,
];
