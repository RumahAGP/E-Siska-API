import { prisma } from "../config/prisma";
import { UserRole } from "../generated/prisma";

// Tipe data input untuk repository
interface CreateGuruInput {
  nip: string;
  nama: string;
  email?: string;
  username: string; // Username untuk login
  passwordHash: string;
  role: UserRole;
}

/**
 * Membuat data Guru dan User baru dalam satu transaksi
 */
export const createGuruRepo = async (data: CreateGuruInput) => {
  const { nip, nama, email, username, passwordHash, role } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat User baru
      const newUser = await tx.user.create({
        data: {
          username: username,
          passwordHash: passwordHash,
          role: role,
        },
      });

      // 2. Buat Guru baru, hubungkan dengan userId
      const newGuru = await tx.guru.create({
        data: {
          nip: nip,
          nama: nama,
          email: email,
          userId: newUser.id, // Menghubungkan ke User
        },
      });

      return { user: newUser, guru: newGuru };
    });

    // Hapus passwordHash dari response
    const { passwordHash: _, ...safeUser } = result.user;

    return { user: safeUser, guru: result.guru };
  } catch (error) {
    // Tangani jika ada error, misal NIP/Username duplikat
    throw error;
  }
};