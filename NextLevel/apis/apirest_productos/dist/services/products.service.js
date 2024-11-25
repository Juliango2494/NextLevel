"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.update = exports.create = exports.findById = exports.findAll = void 0;
const db_config_1 = __importDefault(require("../database/db_config")); // Importamos la conexión a la base de datos
/*// Array que hará las veces de base de datos
let products: Product[] = [
  {
    id: "1",
    name: "Producto Ejemplo",
    cat: "Categoría",
    description: "Descripcion del producto",
    price: 100,
    sourceUrl: "../apis/apirest_productos/src/assets/img_products/ejemplo1.webp"
  }
];*/
// Función para obtener todos los productos
/*export const findAll = () => {
  return products;
};*/
// Función para obtener todos los productos
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_config_1.default.query("SELECT * FROM products");
    return rows;
});
exports.findAll = findAll;
// Función para obtener un producto por ID
/*export const findById = (id: string) => {
  return products.find((product) => product.id === id);
};*/
// Función para obtener un producto por ID
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_config_1.default.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
});
exports.findById = findById;
// Función para crear un nuevo producto
/*export const create = (product: Omit<Product, "id">) => {
  // Generamos un ID único
  const id = Math.random().toString(36).slice(2);

  // Creamos el nuevo producto
  const newProduct = {
    id,
    ...product,
  };

  // Lo agregamos al array
  products.push(newProduct);

  // Retornamos el producto creado
  return newProduct;
};*/
// Función para crear un nuevo producto
const create = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, cat, description, price, image } = product;
    const result = yield db_config_1.default.execute("INSERT INTO products (name, category, description, price, image) VALUES (?, ?, ?, ?, ?)", [name, cat, description, price, image]);
    const insertId = result[0].insertId;
    return Object.assign({ id: insertId.toString() }, product);
});
exports.create = create;
// Función para actualizar un producto
/*export const update = (id: string, changes: Partial<Omit<Product, "id">>) => {
  // Buscamos el índice del producto a actualizar
  const index = products.findIndex((product) => product.id === id);

  // Si existe, actualizamos sus propiedades
  if (index >= 0) {
    products[index] = {
      ...products[index],
      ...changes,
    };

    return products[index];
  }

  // Sino, retornamos null
  return null;
};*/
// Función para actualizar un producto
const update = (id, changes) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = Object.keys(changes);
    const values = Object.values(changes);
    if (keys.length === 0)
        return null;
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const sql = `UPDATE products SET ${setClause} WHERE id = ?`;
    const result = yield db_config_1.default.execute(sql, [...values, id]);
    const affectedRows = result[0].affectedRows;
    if (affectedRows > 0) {
        return (0, exports.findById)(id); // Retorna el producto actualizado
    }
    return null;
});
exports.update = update;
// Función para eliminar un producto
/*export const deleteById = (id: string) => {
  // Buscamos el índice del producto a eliminar
  const index = products.findIndex((product) => product.id === id);

  // Si existe, lo eliminamos del array
  if (index >= 0) {
    products.splice(index, 1);
    return true;
  }

  // Sino, retornamos false
  return false;
};*/
// Función para eliminar un producto
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_config_1.default.execute("DELETE FROM products WHERE id = ?", [id]);
    const affectedRows = result[0].affectedRows;
    return affectedRows > 0;
});
exports.deleteById = deleteById;
