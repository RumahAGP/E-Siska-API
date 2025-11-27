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

export const createGuruValidation = [
  body("nama").notEmpty().withMessage("Nama guru wajib diisi"),
  body("nip").notEmpty().withMessage("NIP wajib diisi"),
  body("username").notEmpty().withMessage("Username login wajib diisi"),
  body("passwordDefault")
    .notEmpty()
    .withMessage("Password default wajib diisi")
    .isLength({ min: 6 })
    .withMessage("Password default minimal 6 karakter"),
  body("email").optional().isEmail().withMessage("Format email tidak valid"),
  validationHandler,
];
