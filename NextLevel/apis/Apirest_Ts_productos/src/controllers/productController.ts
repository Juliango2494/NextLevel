import { Request, Response } from "express";
import { db } from "../config/db";
import { Product } from "../models/product";
import { RowDataPacket } from "mysql2/promise";
import { ResultSetHeader } from "mysql2/promise";
import { RequestHandler } from "express";


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM products");

    // Convertir las imágenes BLOB a base64
    const products = rows.map((product) => {
      return {
        id: product.id,
        name: product.name_p,
        cat: product.category,
        description: product.description_p,
        price: product.price,
        image: product.image ? Buffer.from(product.image).toString("base64") : null, 
      };
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const getProductById = async (
  req: Request<{ id: string }>, // Se asegura que "id" sea parte de los parámetros de la URL
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; 
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  const { name, cat, description, price } = req.body;
  const image = req.file?.buffer; // Tomamos la imagen cargada desde el formulario

  if (!image) {
    res.status(400).json({ message: "La imagen es obligatoria." });
    return; 
  }

  try {
    const query =
      "INSERT INTO products (name_p, category, description_p, price, image) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query<ResultSetHeader>(query, [
      name,
      cat,
      description,
      price,
      image,
    ]);

    res.status(201).json({
      message: "Producto creado exitosamente",
      productId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }>, // Tipamos los parámetros de la URL
  res: Response
): Promise<void> => {
  const { id } = req.params; // Obtenemos el ID del producto desde los parámetros
  const { name_p, category, description_p, price, image } = req.body; // Obtenemos los datos del cuerpo de la solicitud

  try {
    // Ejecutamos la consulta de actualización
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE products SET name_p = ?, category = ?, description_p = ?, price = ?, image = ? WHERE id = ?",
      [name_p, category, description_p, price, image, id]
    );

    // Verificamos si la consulta afectó alguna fila
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    res.json({ message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};

  export const deleteProduct = async (
    req: Request<{ id: string }>, // Tipamos los parámetros de la URL
    res: Response
  ): Promise<void> => {
    const { id } = req.params; // Obtenemos el ID del producto desde los parámetros
  
    try {
      // Ejecutamos la consulta de eliminación
      const [result] = await db.query<ResultSetHeader>(
        "DELETE FROM products WHERE id = ?",
        [id]
      );
  
      // Verificamos si la consulta afectó alguna fila
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }
  
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el producto", error });
    }
  };