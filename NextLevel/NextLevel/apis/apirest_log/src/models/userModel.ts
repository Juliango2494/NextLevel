import mysql from "mysql2";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { RowDataPacket } from 'mysql2';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const userModel = {
  // Función para crear un nuevo usuario
  async createUser(username: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña
    const query = "INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)";
    const [result] = await db.promise().query(query, [username, hashedPassword, role]);
    return result;
  },

  // Función para buscar un usuario por su nombre de usuario
  async findUserByUsername(username: string) {
    const query = "SELECT * FROM usuarios WHERE username = ?";
    const [rows] = await db.promise().query<RowDataPacket[]>(query, [username]); // Tipado explícito
    return rows[0]; // Retorna el primer usuario encontrado
  },
};

export default userModel;


