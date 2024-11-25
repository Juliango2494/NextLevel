import { Router } from "express";
import multer from "multer";
import * as productsCtrl from "../controllers/product.controller";

// Configuración de multer
const storage = multer.diskStorage({
    destination: "./assets/img_products/", // Carpeta donde se guardarán las imágenes
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });

const router = Router();

// GET all products
router.get("/", productsCtrl.getProducts);

// GET one product
router.get("/:id", productsCtrl.getProduct);

// POST create product
//router.post("/", productsCtrl.createProduct);

// POST create product (incluye middleware de multer)
router.post("/", upload.single("image"), productsCtrl.createProduct);

// PUT update product
router.put("/:id", productsCtrl.updateProduct);

// DELETE product
router.delete("/:id", productsCtrl.deleteProduct);

export default router;
