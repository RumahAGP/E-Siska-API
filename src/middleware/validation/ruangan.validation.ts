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

export const createRuanganValidation = [
  body("namaRuangan").notEmpty().withMessage("Nama ruangan wajib diisi"),
  body("kapasitas")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Kapasitas harus berupa angka positif"),
  validationHandler,
];
