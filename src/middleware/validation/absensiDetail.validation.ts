import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { AbsensiStatus } from "../../generated/prisma";

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

export const inputAbsensiValidation = [
  param("sesiId").isUUID().withMessage("Format sesiId tidak valid"),
  body("data")
    .isArray({ min: 1 })
    .withMessage("Data absensi harus berupa array dan tidak boleh kosong"),
  body("data.*.siswaId").isUUID().withMessage("Format siswaId tidak valid"),
  body("data.*.status")
    .isIn(Object.values(AbsensiStatus))
    .withMessage(
      `Status harus salah satu dari: ${Object.values(AbsensiStatus).join(", ")}`
    ),
  validationHandler,
];
