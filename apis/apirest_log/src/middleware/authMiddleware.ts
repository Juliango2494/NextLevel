import { Request, Response, NextFunction } from "express";
import jwt from "jwt-simple";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No se ha proporcionado un token" });
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET as string);
    req.user = decoded.user; // Agregar los datos del usuario decodificado a la solicitud
    next(); // Continuar con la siguiente función del middleware o controlador
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};
