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

export const inputNilaiValidation = [
  body("guruId").isUUID().withMessage("Format guruId tidak valid"),
  body("mapelId").isUUID().withMessage("Format mapelId tidak valid"),
  body("komponenId").isUUID().withMessage("Format komponenId tidak valid"),
  body("data")
    .isArray({ min: 1 })
    .withMessage("Data nilai harus berupa array dan tidak boleh kosong"),
  body("data.*.siswaId").isUUID().withMessage("Format siswaId tidak valid"),
  body("data.*.nilai")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Nilai harus berupa angka antara 0 - 100"),
  validationHandler,
];
