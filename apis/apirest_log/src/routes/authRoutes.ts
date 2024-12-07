import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();

router.post("/register", async (req, res) => {
  await authController.register(req, res);  
});

router.post("/login", async (req, res) => {
  await authController.login(req, res); 
});

export default router;
