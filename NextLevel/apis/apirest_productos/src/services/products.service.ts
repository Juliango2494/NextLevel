// Importamos la interfaz Product
import { Product } from "../models/product.model";
import db from "../database/db_config"; // Importamos la conexión a la base de datos
import { RowDataPacket } from "mysql2/promise";

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
export const findAll = async (): Promise<Product[]> => {
  const [rows] = await db.query<Product[] & RowDataPacket[]>("SELECT * FROM products");
  return rows;
};

// Función para obtener un producto por ID
/*export const findById = (id: string) => {
  return products.find((product) => product.id === id);
};*/
// Función para obtener un producto por ID
export const findById = async (id: string): Promise<Product | null> => {
  const [rows] = await db.query<Product[] & RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
};

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
export const create = async (product: Omit<Product, "id">): Promise<Product> => {
  const { name, cat, description, price, image } = product;
  
  const result = await db.execute(
    "INSERT INTO products (name, category, description, price, image) VALUES (?, ?, ?, ?, ?)",
    [name, cat, description, price, image]
  );

  const insertId = (result[0] as { insertId: number }).insertId;

  return { id: insertId.toString(), ...product };
};

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
export const update = async (
  id: string,
  changes: Partial<Omit<Product, "id">>
): Promise<Product | null> => {
  const keys = Object.keys(changes);
  const values = Object.values(changes);

  if (keys.length === 0) return null;

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const sql = `UPDATE products SET ${setClause} WHERE id = ?`;
  const result = await db.execute(sql, [...values, id]);

  const affectedRows = (result[0] as { affectedRows: number }).affectedRows;
  if (affectedRows > 0) {
    return findById(id); // Retorna el producto actualizado
  }

  return null;
};

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
export const deleteById = async (id: string): Promise<boolean> => {
  const result = await db.execute("DELETE FROM products WHERE id = ?", [id]);
  const affectedRows = (result[0] as { affectedRows: number }).affectedRows;

  return affectedRows > 0;
};
