"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Importa cors
const products_route_1 = __importDefault(require("./routes/products.route"));
const app = (0, express_1.default)();
// Configurar CORS
app.use((0, cors_1.default)({ origin: 'http://127.0.0.1:5500' }));
app.use(express_1.default.json());
app.use('/api/products', products_route_1.default);
exports.default = app;
