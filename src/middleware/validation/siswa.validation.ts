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

export const createSiswaValidation = [
  body("nama").notEmpty().withMessage("Nama siswa wajib diisi"),
  body("nis")
    .notEmpty()
    .withMessage("NIS wajib diisi")
    .isLength({ min: 6 })
    .withMessage("NIS harus memiliki minimal 6 digit"),
  body("tanggalLahir")
    .optional()
    .isISO8601()
    .withMessage("Format tanggal lahir harus YYYY-MM-DD"),
  validationHandler,
];
