// Importamos la interfaz Product
import { Product } from "../models/product.model";

// Array que hará las veces de base de datos
let products: Product[] = [
  {
    id: "1",
    name: "Producto Ejemplo",
    cat: "Categoría",
    description: "Descripcion del producto",
    price: 100,
    sourceUrl: "../apis/apirest_productos/src/assets/img_products/ejemplo1.webp"
  }
];

// Función para obtener todos los productos
export const findAll = () => {
  return products;
};

// Función para obtener un producto por ID
export const findById = (id: string) => {
  return products.find((product) => product.id === id);
};

// Función para crear un nuevo producto
export const create = (product: Omit<Product, "id">) => {
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
};

// Función para actualizar un producto
export const update = (id: string, changes: Partial<Omit<Product, "id">>) => {
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
};

// Función para eliminar un producto
export const deleteById = (id: string) => {
  // Buscamos el índice del producto a eliminar
  const index = products.findIndex((product) => product.id === id);

  // Si existe, lo eliminamos del array
  if (index >= 0) {
    products.splice(index, 1);
    return true;
  }

  // Sino, retornamos false
  return false;
};
