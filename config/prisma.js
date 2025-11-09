import { DATABASE_URL } from '../routes/config.js';
import { PrismaClient } from '@prisma/client';

const databaseUrl = DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'Falta la variable de entorno DATABASE_URL. Crea server/.env con DATABASE_URL, por ejemplo: DATABASE_URL="file:./dev.db" (SQLite) o postgres://user:pass@host:port/dbname'
  );
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: databaseUrl },
  },
});

export default prisma;