import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import AppError from "../utils/AppError";
import { UserRole } from "../generated/prisma";
import { prisma } from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        adminId?: string;
        guruId?: string;
        siswaId?: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        "Token tidak ditemukan. Silakan login terlebih dahulu.",
        401
      );
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      throw new AppError("Token tidak valid.", 401);
    }

    const decoded = verify(token, JWT_SECRET) as {
      id: string;
      role: UserRole;
    };

    let userData: any = {
      id: decoded.id,
      role: decoded.role,
    };

    if (decoded.role === UserRole.ADMIN) {
      const admin = await prisma.admin.findUnique({
        where: { userId: decoded.id },
        select: { id: true },
      });
      if (admin) {
        userData.adminId = admin.id;
      }
    } else if (decoded.role === UserRole.GURU) {
      const guru = await prisma.guru.findUnique({
        where: { userId: decoded.id },
        select: { id: true },
      });
      if (guru) {
        userData.guruId = guru.id;
      }
    } else if (decoded.role === UserRole.SISWA) {
      const siswa = await prisma.siswa.findUnique({
        where: { userId: decoded.id },
        select: { id: true },
      });
      if (siswa) {
        userData.siswaId = siswa.id;
      }
    }

    req.user = userData;

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Token tidak valid.", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Token sudah kadaluarsa. Silakan login kembali.", 401)
      );
    }
    next(error);
  }
};

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(
      new AppError("Unauthorized. Silakan login terlebih dahulu.", 401)
    );
  }

  if (req.user.role !== UserRole.ADMIN) {
    return next(
      new AppError("Akses ditolak. Hanya Admin yang dapat mengakses.", 403)
    );
  }

  next();
};

export const guruGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(
      new AppError("Unauthorized. Silakan login terlebih dahulu.", 401)
    );
  }

  if (req.user.role !== UserRole.GURU) {
    return next(
      new AppError("Akses ditolak. Hanya Guru yang dapat mengakses.", 403)
    );
  }

  next();
};

export const siswaGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(
      new AppError("Unauthorized. Silakan login terlebih dahulu.", 401)
    );
  }

  if (req.user.role !== UserRole.SISWA) {
    return next(
      new AppError("Akses ditolak. Hanya Siswa yang dapat mengakses.", 403)
    );
  }

  next();
};

export const waliKelasGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(
        new AppError("Unauthorized. Silakan login terlebih dahulu.", 401)
      );
    }

    if (req.user.role !== UserRole.GURU) {
      return next(
        new AppError("Akses ditolak. Hanya Guru yang dapat mengakses.", 403)
      );
    }

    const guru = await prisma.guru.findUnique({
      where: { id: req.user.guruId },
      include: {
        KelasBimbingan: true,
      },
    });

    if (!guru || !guru.KelasBimbingan) {
      return next(
        new AppError(
          "Akses ditolak. Hanya Wali Kelas yang dapat mengakses.",
          403
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const adminOrGuruGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(
      new AppError("Unauthorized. Silakan login terlebih dahulu.", 401)
    );
  }

  if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.GURU) {
    return next(
      new AppError(
        "Akses ditolak. Hanya Admin atau Guru yang dapat mengakses.",
        403
      )
    );
  }

  next();
};
