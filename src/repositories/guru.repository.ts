import { prisma } from "../config/prisma";
import { UserRole } from "../generated/prisma";

interface CreateGuruInput {
  nip: string;
  nama: string;
  email?: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  jenisKelamin?: string;
  agama?: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  noTelp?: string;
  nik?: string;
  nuptk?: string;
  statusKepegawaian?: string;
  alamat?: string;
  isAktif?: boolean;
}

export const createGuruRepo = async (data: CreateGuruInput) => {
  const {
    nip,
    nama,
    email,
    username,
    passwordHash,
    role,
    jenisKelamin,
    agama,
    tempatLahir,
    tanggalLahir,
    noTelp,
    nik,
    nuptk,
    statusKepegawaian,
    alamat,
    isAktif,
  } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: username,
          passwordHash: passwordHash,
          role: role,
        },
      });

      const newGuru = await tx.guru.create({
        data: {
          nip: nip,
          nama: nama,
          email: email,
          userId: newUser.id,
          jenisKelamin,
          agama,
          tempatLahir,
          tanggalLahir,
          noTelp,
          nik,
          nuptk,
          statusKepegawaian,
          alamat,
          isAktif,
        },
      });

      return { user: newUser, guru: newGuru };
    });

    const { passwordHash: _, ...safeUser } = result.user;

    return { user: safeUser, guru: result.guru };
  } catch (error) {
    throw error;
  }
};

export const getAllGuruRepo = async (skip?: number, take?: number) => {
  return prisma.guru.findMany({
    skip: skip || 0,
    take: take || 100,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
          isWaliKelas: true,
        },
      },
      KelasBimbingan: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
};

export const getGuruByIdRepo = async (id: string) => {
  return prisma.guru.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
          isWaliKelas: true,
        },
      },
      KelasBimbingan: true,
      Penugasan: {
        include: {
          mapel: true,
          kelas: true,
        },
      },
    },
  });
};

interface UpdateGuruInput {
  nip?: string;
  nama?: string;
  email?: string;
  jenisKelamin?: string;
  agama?: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  noTelp?: string;
  nik?: string;
  nuptk?: string;
  statusKepegawaian?: string;
  alamat?: string;
  isAktif?: boolean;
}

export const updateGuruRepo = async (id: string, data: UpdateGuruInput) => {
  return prisma.guru.update({
    where: { id },
    data: {
      ...(data.nip && { nip: data.nip }),
      ...(data.nama && { nama: data.nama }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.jenisKelamin && { jenisKelamin: data.jenisKelamin }),
      ...(data.agama && { agama: data.agama }),
      ...(data.tempatLahir && { tempatLahir: data.tempatLahir }),
      ...(data.tanggalLahir && { tanggalLahir: data.tanggalLahir }),
      ...(data.noTelp && { noTelp: data.noTelp }),
      ...(data.nik && { nik: data.nik }),
      ...(data.nuptk && { nuptk: data.nuptk }),
      ...(data.statusKepegawaian && {
        statusKepegawaian: data.statusKepegawaian,
      }),
      ...(data.alamat && { alamat: data.alamat }),
      ...(data.isAktif !== undefined && { isAktif: data.isAktif }),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    },
  });
};

export const deleteGuruRepo = async (id: string) => {
  return prisma.guru.delete({
    where: { id },
  });
};
