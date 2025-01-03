import { Request, Response } from "express";
import { db } from "../config/db";
import { Product } from "../models/product";
import { RowDataPacket } from "mysql2/promise";
import { ResultSetHeader } from "mysql2/promise";
import { RequestHandler } from "express";


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM productos_tienda");

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
export const getSillas = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM productos_tienda where category='sillas-gamer'");

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
    res.status(500).json({ message: "Error al obtener filtro 'sillas-gamer'" });
  }
};
export const getEquipos = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM productos_tienda where category='equipos'");

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
    res.status(500).json({ message: "Error al obtener filtro 'equipos'" });
  }
};
export const getAccesorios = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM productos_tienda where category='accesorios'");

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
    res.status(500).json({ message: "Error al obtener filtro 'accesorios'" });
  }
};


export const getProductById = async (
  req: Request<{ id: string }>, // Se asegura que "id" sea parte de los parámetros de la URL
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM productos_tienda WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    const product = rows[0];

    // Convertir la imagen (BLOB) a base64 si está presente
    const productWithBase64Image = {
      id: product.id,
      name: product.name_p,
      category: product.category,
      description: product.description_p,
      price: product.price,
      image: product.image ? Buffer.from(product.image).toString("base64") : null,
    };

    res.json(productWithBase64Image);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
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
      "INSERT INTO productos_tienda (name_p, category, description_p, price, image) VALUES (?, ?, ?, ?, ?)";
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
  const { name_p, category, description_p, price } = req.body; // Obtenemos los datos del cuerpo de la solicitud
  const image = req.file?.filename; // Obtener la imagen si se subió una nueva

  try {
    // Consulta para actualizar, omitiendo la imagen si no se subió una nueva
    const query = image
      ? "UPDATE productos_tienda SET name_p = ?, category = ?, description_p = ?, price = ?, image = ? WHERE id = ?"
      : "UPDATE productos_tienda SET name_p = ?, category = ?, description_p = ?, price = ? WHERE id = ?";
    const params = image
      ? [name_p, category, description_p, price, image, id]
      : [name_p, category, description_p, price, id];

    const [result] = await db.query<ResultSetHeader>(query, params);

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
        "DELETE FROM productos_tienda WHERE id = ?",
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

  // CONTROLADORES PARA LOGIN DE USUARIOS:
  export const loginUsuario: RequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body; // Email y contraseña ingresados por el usuario
  
      // Buscar el usuario por email
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT id, email, usrPassword, direccion, usrRole FROM usuarios WHERE email = ?",
        [email]
      );
  
      if (rows.length === 0) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return; // Asegúrate de terminar aquí para evitar problemas con el flujo
      }
  
      const usuario = rows[0];
  
      // Validar la contraseña en texto plano
      if (password !== usuario.usrPassword) {
        res.status(401).json({ message: "Contraseña incorrecta" });
        return;
      }
  
      // Enviar una respuesta con los datos del usuario, excluyendo la contraseña
      res.json({
        id: usuario.id,
        email: usuario.email,
        direccion: usuario.direccion,
        role: usuario.usrRole,
        message: "Inicio de sesión exitoso",
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  export const createUsr = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, email, usrPassword, direccion } = req.body;
  
      // Validación básica
      if (!id || !email || !usrPassword || !direccion) {
        res.status(400).json({ message: "Todos los campos son obligatorios" });
        return;
      }
  
      // Consulta SQL para insertar el nuevo usuario
      const query = `
        INSERT INTO usuarios (id, email, usrPassword, direccion) 
        VALUES (?, ?, ?, ?)
      `;
  
      const [result] = await db.query<ResultSetHeader>(query, [id, email, usrPassword, direccion]);
  
      // Responder con éxito y el ID del nuevo usuario
      res.status(201).json({
        message: "Usuario creado exitosamente",
        userId: result.insertId,
      });
    } catch (error: any) {
      console.error("Error al crear el usuario:", error);
  
      // Manejo de errores comunes, como un email duplicado
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ message: "El correo electrónico ya está registrado" });
        return;
      }
  
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };