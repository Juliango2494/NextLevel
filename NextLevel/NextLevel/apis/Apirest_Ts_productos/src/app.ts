import express from "express";
import productRoutes from "./routes/productRoutes";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500", // Permite solicitudes desde este origen
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
  }));
// Middleware
app.use(bodyParser.json());
app.use("/products", productRoutes);

export default app;
