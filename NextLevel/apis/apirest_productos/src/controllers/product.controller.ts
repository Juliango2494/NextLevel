import { Request, Response } from "express";
import { Product } from "../models/product.model";
import * as productsService from "../services/products.service";


export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await productsService.findAll();
    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await productsService.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      ...product,
      image: product.image.toString("base64"), // Codifica el blob a Base64
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
/*export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await productsService.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};*/

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, cat, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageBuffer = req.file.buffer; // Obtén la imagen como buffer
    const newProduct = await productsService.create({
      name,
      cat,
      description,
      price: parseFloat(price),
      image: imageBuffer, // Almacena la imagen como blob
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/*export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name,cat, description, price, sourceUrl } = req.body;
    const newProduct = await productsService.create({ name, cat, description, price, sourceUrl });
    res.status(201).json(newProduct);
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};*/

/*export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, cat, description, price } = req.body;
    // Verifica si el archivo fue subido
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    // Construye la ruta de la imagen
    const sourceUrl = `../apis/apirest_productos/src/assets/img_products/${req.file.filename}`;
    // Crea el producto
    const newProduct = await productsService.create({
      name,
      cat,
      description,
      price: parseFloat(price),
      sourceUrl,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};*/

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, price } = req.body;

    const updatedProduct = await productsService.update(id, {
      name,
      price,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deleted = await productsService.deleteById(id);

    if (!deleted) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("Deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
};
