import { compare } from "bcrypt";
import AppError from "../utils/AppError";
import { createToken } from "../utils/createToken";
import { findUserByUsernameRepo } from "../repositories/user.repository";

export const loginService = async (data: {
  username: string;
  password: string;
}) => {
  const user = await findUserByUsernameRepo(data.username);

  if (!user) {
    throw new AppError("Akun tidak ditemukan", 404);
  }

  const comparePass = await compare(data.password, user.passwordHash);
  if (!comparePass) {
    throw new AppError("Password salah", 400);
  }

  const { passwordHash, ...accountData } = user;

  const token = createToken(accountData, "24h");

  return { ...accountData, token };
};
