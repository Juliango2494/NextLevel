import { Router } from "express";
import * as ctrl from "../controllers/productController";
import multer from "multer";

const storage = multer.memoryStorage(); // Usamos memoria para almacenar la imagen temporalmente
const upload = multer({ storage }); // Configuración de Multer

const router = Router();

router.get("/", ctrl.getAllProducts);
router.get("/sillas", ctrl.getSillas);
router.get("/equipos", ctrl.getEquipos);
router.get("/accesorios", ctrl.getAccesorios);
router.get("/:id", ctrl.getProductById);
router.post("/", upload.single("image"), ctrl.createProduct);
router.put("/:id", upload.single("image"), ctrl.updateProduct);
router.delete("/:id", ctrl.deleteProduct);

export default router;

