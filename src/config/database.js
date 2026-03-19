const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432, 
  user: process.env.DB_USER || 'postgres', 
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'SaludTech', 
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log(' Conexión a PostgreSQL establecida correctamente');
    client.release();
  } catch (error) {
    console.error(' Error al conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };