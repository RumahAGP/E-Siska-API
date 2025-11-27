import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { MapelCategory } from "../../generated/prisma";

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

export const createMapelValidation = [
  body("namaMapel").notEmpty().withMessage("Nama mata pelajaran wajib diisi"),
  body("kategori")
    .notEmpty()
    .withMessage("Kategori wajib diisi")
    .isIn(Object.values(MapelCategory))
    .withMessage(
      `Kategori tidak valid. Pilih dari: ${Object.values(MapelCategory).join(
        ", "
      )}`
    ),
  validationHandler,
];
