import express from 'express';
import cors from 'cors'; // Importa cors
import productsRouter from './routes/products.route';

const app = express();

// Configurar CORS
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

app.use(express.json());

app.use('/api/products', productsRouter);

export default app;