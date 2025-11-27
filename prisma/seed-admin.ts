import { prisma } from "../src/config/prisma";
import bcrypt from "bcrypt";
import logger from "../src/utils/logger";

async function seedAdmin() {
  try {
    logger.info("Starting admin seed...");

    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (existingAdmin) {
      logger.warn("Admin user already exists. Skipping...");
      console.log("✅ Admin user already exists!");
      return;
    }

    const passwordHash = await bcrypt.hash("admin123", 10);

    const adminUser = await prisma.user.create({
      data: {
        username: "admin",
        passwordHash: passwordHash,
        role: "ADMIN",
      },
    });

    logger.info(`Admin user created: ${adminUser.id}`);

    const adminProfile = await prisma.admin.create({
      data: {
        userId: adminUser.id,
        nama: "Administrator",
      },
    });

    logger.info(`Admin profile created: ${adminProfile.id}`);

    console.log("\n✅ Admin account created successfully!");
    console.log("━".repeat(50));
    console.log("📝 Admin Credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("━".repeat(50));
    console.log("\n⚠️  IMPORTANT: Change password after first login!");
    console.log("\n");
  } catch (error) {
    logger.error(`Error seeding admin: ${error}`);
    console.error("❌ Error creating admin:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin()
  .then(() => {
    console.log("✅ Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
