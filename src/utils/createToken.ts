import { sign } from "jsonwebtoken";

export const createToken = (account: any, expiresIn: any) => {
  const secret = process.env.JWT_SECRET || "secret";

  return sign(
    {
      id: account.id,
      role: account.role,
    },
    secret,
    {
      expiresIn,
    }
  );
};
