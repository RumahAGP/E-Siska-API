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

export const createKelasValidation = [
  body("namaKelas").notEmpty().withMessage("Nama kelas wajib diisi"),
  body("tingkatanId")
    .notEmpty()
    .withMessage("ID Tingkatan Kelas wajib diisi")
    .isUUID()
    .withMessage("Format ID Tingkatan tidak valid"),
  body("waliKelasId")
    .optional()
    .isUUID()
    .withMessage("Format ID Wali Kelas tidak valid"),
  validationHandler,
];
