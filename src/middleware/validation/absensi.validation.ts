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

export const createSesiValidation = [
  body("guruId").isUUID().withMessage("Format guruId tidak valid"),
  body("kelasId").isUUID().withMessage("Format kelasId tidak valid"),
  body("tanggal")
    .isISO8601()
    .withMessage("Format tanggal harus YYYY-MM-DD (ISO8601)"),
  body("pertemuanKe")
    .isInt({ min: 1 })
    .withMessage("Pertemuan ke harus angka positif"),
  validationHandler,
];
