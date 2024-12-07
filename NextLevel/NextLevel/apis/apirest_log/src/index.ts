import express from "express";
import helmet from "helmet";
import mysql from "mysql2";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config(); // Cargar las variables de entorno

const app = express(); // Crear la app express

// Conectar a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos MySQL");
  }
});

app.use(helmet()); // Usar Helmet para mejorar la seguridad
app.use(express.json()); // Middleware para parsear JSON

// Rutas de autenticación
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
