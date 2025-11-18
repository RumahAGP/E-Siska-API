import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

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

export const inputRaporValidation = [
  param("siswaId").isUUID().withMessage("Format siswaId tidak valid"),
  body("guruId").isUUID().withMessage("Format guruId tidak valid"), // Nanti diambil dari token
  body("tahunAjaranId").isUUID().withMessage("Format tahunAjaranId tidak valid"),
  body("catatan").optional().isString(),
  body("kokurikuler").optional().isString(),
  validationHandler,
];