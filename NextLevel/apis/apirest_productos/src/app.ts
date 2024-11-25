import express from 'express';
import productsRouter from './routes/products.route';
import dotenv from 'dotenv';
import cors from 'cors'; // Importa cors

dotenv.config();


const app = express();

// Configurar CORS
app.use(cors());

app.use(express.json());

app.use('/api/proyectoproductos', productsRouter);

export default app;