import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const parseNumberEnv = (name: string): number => {
  const value = requireEnv(name);
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }
  return parsed;
};

let pool: mysql.Pool | null = null;

export const getPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: requireEnv('DB_HOST'),
      port: parseNumberEnv('DB_PORT'),
      user: requireEnv('DB_USER'),
      password: requireEnv('DB_PASSWORD'),
      database: requireEnv('DB_NAME'),
      connectionLimit: parseNumberEnv('DB_CONNECTION_LIMIT'),
      waitForConnections: true,
      queueLimit: 0,
    });
  }

  return pool;
};

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await getPool().getConnection();
    console.log('✓ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
};

export default getPool;
