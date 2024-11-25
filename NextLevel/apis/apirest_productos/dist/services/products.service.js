"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.update = exports.create = exports.findById = exports.findAll = void 0;
// Array que hará las veces de base de datos
let products = [
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
const findAll = () => {
    return products;
};
exports.findAll = findAll;
// Función para obtener un producto por ID
const findById = (id) => {
    return products.find((product) => product.id === id);
};
exports.findById = findById;
// Función para crear un nuevo producto
const create = (product) => {
    // Generamos un ID único
    const id = Math.random().toString(36).slice(2);
    // Creamos el nuevo producto
    const newProduct = Object.assign({ id }, product);
    // Lo agregamos al array
    products.push(newProduct);
    // Retornamos el producto creado
    return newProduct;
};
exports.create = create;
// Función para actualizar un producto
const update = (id, changes) => {
    // Buscamos el índice del producto a actualizar
    const index = products.findIndex((product) => product.id === id);
    // Si existe, actualizamos sus propiedades
    if (index >= 0) {
        products[index] = Object.assign(Object.assign({}, products[index]), changes);
        return products[index];
    }
    // Sino, retornamos null
    return null;
};
exports.update = update;
// Función para eliminar un producto
const deleteById = (id) => {
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
exports.deleteById = deleteById;
