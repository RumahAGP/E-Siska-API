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

export const createPengumumanValidation = [
  body("judul").notEmpty().withMessage("Judul pengumuman wajib diisi"),
  body("konten").notEmpty().withMessage("Konten pengumuman wajib diisi"),
  validationHandler,
];
