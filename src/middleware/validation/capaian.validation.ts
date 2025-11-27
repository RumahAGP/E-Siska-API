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

export const inputCapaianValidation = [
  body("guruId").isUUID().withMessage("Format guruId tidak valid"),
  body("mapelId").isUUID().withMessage("Format mapelId tidak valid"),
  body("data")
    .isArray({ min: 1 })
    .withMessage("Data capaian harus berupa array dan tidak boleh kosong"),
  body("data.*.siswaId").isUUID().withMessage("Format siswaId tidak valid"),
  body("data.*.deskripsi")
    .notEmpty()
    .withMessage("Deskripsi wajib diisi")
    .isString()
    .withMessage("Deskripsi harus berupa teks"),
  validationHandler,
];
