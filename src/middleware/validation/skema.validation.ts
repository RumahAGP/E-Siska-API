import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { NilaiKomponenType } from "../../generated/prisma";

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

export const addKomponenValidation = [
  param("skemaId")
    .notEmpty()
    .withMessage("skemaId URL parameter wajib diisi")
    .isUUID()
    .withMessage("Format skemaId tidak valid"),
  body("namaKomponen")
    .notEmpty()
    .withMessage("Nama komponen wajib diisi")
    .isString(),
  body("tipe")
    .notEmpty()
    .withMessage("Tipe komponen wajib diisi")
    .isIn(Object.values(NilaiKomponenType))
    .withMessage(
      `Tipe tidak valid. Pilih dari: ${Object.values(NilaiKomponenType).join(
        ", "
      )}`
    ),
  body("urutan")
    .notEmpty()
    .withMessage("Urutan wajib diisi")
    .isInt({ min: 1 })
    .withMessage("Urutan harus angka positif"),
  body("formula").optional().isString(),
  validationHandler,
];
