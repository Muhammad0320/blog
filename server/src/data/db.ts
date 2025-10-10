import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function checkConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database connected successfully ");
  } catch (error) {
    console.error("❌ Could not connect to database:", error);
  }
}

checkConnection();

export default pool;
