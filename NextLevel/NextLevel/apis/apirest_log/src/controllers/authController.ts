import { Request, Response } from "express";  // Asegúrate de tener estas importaciones
import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import userModel from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();

const authController = {
  // Función para registrar un nuevo usuario
  async register(req: Request, res: Response): Promise<Response> {  // Tipo de retorno Promise<Response>
    const { username, password, role } = req.body;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ msg: "El usuario ya existe" });
      }

      // Crear el nuevo usuario
      await userModel.createUser(username, password, role);
      return res.status(201).json({ msg: "Usuario registrado con éxito" });
    } catch (error) {
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },

  // Función para iniciar sesión (login) de un usuario
  async login(req: Request, res: Response): Promise<Response> {  // Tipo de retorno Promise<Response>
    const { username, password } = req.body;

    try {
      // Buscar al usuario por su nombre de usuario
      const user = await userModel.findUserByUsername(username);
      if (!user) {
        return res.status(400).json({ msg: "Usuario no encontrado" });
      }

      // Verificar si la contraseña es correcta
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Contraseña incorrecta" });
      }

      // Crear el token JWT
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };

      const token = jwt.encode(payload, process.env.JWT_SECRET as string);
      return res.json({ token });
    } catch (error) {
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },
};

export default authController;

