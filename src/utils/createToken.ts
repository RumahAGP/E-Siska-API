import { sign } from "jsonwebtoken";

export const createToken = (account: any, expiresIn: any) => {
  // Gunakan logika yang sama persis dengan middleware
  const secret = process.env.JWT_SECRET || "secret";
  
  return sign(
    {
      id: account.id,
      role: account.role,
    },
    secret, // Gunakan variabel secret yang dinamis
    {
      expiresIn,
    }
  );
};