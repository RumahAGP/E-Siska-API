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

// Regex sederhana untuk format HH:MM
const timeFormatRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const createJadwalValidation = [
  body("tahunAjaranId")
    .isUUID()
    .withMessage("Format tahunAjaranId tidak valid"),
  body("kelasId").isUUID().withMessage("Format kelasId tidak valid"),
  body("mapelId").isUUID().withMessage("Format mapelId tidak valid"),
  body("guruId").isUUID().withMessage("Format guruId tidak valid"),
  body("ruanganId").isUUID().withMessage("Format ruanganId tidak valid"),
  body("hari").notEmpty().withMessage("Hari wajib diisi"),
  body("waktuMulai")
    .notEmpty()
    .withMessage("Waktu mulai wajib diisi")
    .matches(timeFormatRegex)
    .withMessage("Format waktuMulai harus HH:MM (contoh: 07:30)"),
  body("waktuSelesai")
    .notEmpty()
    .withMessage("Waktu selesai wajib diisi")
    .matches(timeFormatRegex)
    .withMessage("Format waktuSelesai harus HH:MM (contoh: 09:00)"),
  validationHandler,
];