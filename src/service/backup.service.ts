import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

const execAsync = promisify(exec);

/**
 * Create database backup using pg_dump
 */
export const createBackupService = async () => {
  logger.info('Creating database backup');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

  // Create backups directory if not exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Get database connection from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new AppError("DATABASE_URL tidak ditemukan di environment variables", 500);
  }

  try {
    // Parse database URL to get components
    const dbUrl = new URL(databaseUrl);
    const dbName = dbUrl.pathname.slice(1); // Remove leading /
    const dbHost = dbUrl.hostname;
    const dbPort = dbUrl.port || '5432';
    const dbUser = dbUrl.username;
    const dbPassword = dbUrl.password;

    // Set PGPASSWORD environment variable for pg_dump
    const pgDumpCommand = `PGPASSWORD="${dbPassword}" pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -F p -f "${backupFile}" ${dbName}`;

    logger.info(`Executing backup command for database: ${dbName}`);

    await execAsync(pgDumpCommand, {
      env: { ...process.env, PGPASSWORD: dbPassword },
    });

    logger.info(`Backup created successfully: ${backupFile}`);

    return {
      message: "Backup berhasil dibuat",
      filename: path.basename(backupFile),
      path: backupFile,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`Backup failed: ${error}`);
    throw new AppError("Gagal membuat backup database", 500);
  }
};

/**
 * List all available backups
 */
export const listBackupsService = async () => {
  logger.info('Listing all backups');

  const backupDir = path.join(process.cwd(), 'backups');

  if (!fs.existsSync(backupDir)) {
    return [];
  }

  const files = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        filename: file,
        path: filePath,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return files;
};

/**
 * Restore database from backup file
 * WARNING: This will overwrite current database!
 */
export const restoreBackupService = async (filename: string) => {
  logger.warn(`RESTORE REQUESTED for file: ${filename}`);

  const backupDir = path.join(process.cwd(), 'backups');
  const backupFile = path.join(backupDir, filename);

  // Check if backup file exists
  if (!fs.existsSync(backupFile)) {
    throw new AppError("File backup tidak ditemukan", 404);
  }

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new AppError("DATABASE_URL tidak ditemukan di environment variables", 500);
  }

  try {
    const dbUrl = new URL(databaseUrl);
    const dbName = dbUrl.pathname.slice(1);
    const dbHost = dbUrl.hostname;
    const dbPort = dbUrl.port || '5432';
    const dbUser = dbUrl.username;
    const dbPassword = dbUrl.password;

    // WARNING: This will DROP and RECREATE the database
    const psqlCommand = `PGPASSWORD="${dbPassword}" psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f "${backupFile}"`;

    logger.warn(`Executing restore command - THIS WILL OVERWRITE DATABASE: ${dbName}`);

    await execAsync(psqlCommand, {
      env: { ...process.env, PGPASSWORD: dbPassword },
    });

    logger.info(`Database restored successfully from: ${backupFile}`);

    return {
      message: "Database berhasil di-restore",
      filename: filename,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`Restore failed: ${error}`);
    throw new AppError("Gagal restore database", 500);
  }
};

/**
 * Delete backup file
 */
export const deleteBackupService = async (filename: string) => {
  logger.info(`Deleting backup: ${filename}`);

  const backupDir = path.join(process.cwd(), 'backups');
  const backupFile = path.join(backupDir, filename);

  if (!fs.existsSync(backupFile)) {
    throw new AppError("File backup tidak ditemukan", 404);
  }

  fs.unlinkSync(backupFile);

  logger.info(`Backup deleted: ${filename}`);

  return { message: "Backup berhasil dihapus" };
};
