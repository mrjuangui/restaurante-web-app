import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necesario en Render + Supabase
  },
});

// Test de conexión al arrancar
(async () => {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT version(), current_database(), inet_server_addr()");
    console.log("✅ Conectado a Supabase con éxito");
    console.log("📌 Versión de Postgres:", res.rows[0].version);
    console.log("📌 Base de datos:", res.rows[0].current_database);
    console.log("📌 Dirección del servidor:", res.rows[0].inet_server_addr);
    client.release();
  } catch (err) {
    console.error("❌ Error al conectar con Supabase:", err.message);
  }
})();

export default pool;
