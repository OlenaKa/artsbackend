require('dotenv').config();
var mariadb = require('mariadb');

var pool = mariadb.createPool({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
});

// module.exports = Object.freeze({
//   pool: pool,
// });

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
};

// module.exports.testConnection = testConnection;
export default pool;
