import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import userModel from "../models/userModel";
import dotenv from "dotenv";

dotenv.config();

const authController = {
  // Registro de un nuevo usuario
  async register(req: Request, res: Response): Promise<Response> {
    const { username, password, role = "user" } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ msg: "Nombre de usuario y contraseña son obligatorios" });
    }

    try {
      // Verificar si el usuario ya existe
      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ msg: "El usuario ya existe" });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      await userModel.createUser(username, hashedPassword, role);

      return res.status(201).json({ msg: "Usuario registrado con éxito" });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },

  // Inicio de sesión
  async login(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ msg: "Nombre de usuario y contraseña son obligatorios" });
    }

    try {
      // Buscar al usuario
      const user = await userModel.findUserByUsername(username);
      if (!user) {
        return res.status(400).json({ msg: "Usuario no encontrado" });
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Contraseña incorrecta" });
      }

      // Crear JWT
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      const token = jwt.encode(payload, process.env.JWT_SECRET as string);

      return res.json({ msg: "Inicio de sesión exitoso", token });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },
};

export default authController;
