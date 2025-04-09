import { storeAttachment } from "./attachment.service";
import path from "path";
import fs from "fs";
import { isValidObjectId } from "mongoose";
import { Product, IProduct } from "../models/product.model";

export const createProductService = async (
  req: any,
  name: string,
  description: string,
  price: string,
  mrp: string,
  discount: string,
  specification: string,
  weight: string,
  inStock: string,
  isAvailable: string,
  coupons: string,
  details: string
) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("No file uploaded.");
    }

    if (req.files.length) {
      const bufferData = req.files[0].buffer;
      const mimeType = req.files[0]?.mimetype;
      const originalFileName = req.files[0].originalname;
      const extension = path.extname(originalFileName).slice(1);
      const fileName = `${new Date().getTime()}.${extension}`;
      const imgPath = path.join(__dirname, "../../public/images", fileName);
      fs.writeFileSync(imgPath, bufferData);

      const attachmentData = await storeAttachment(
        originalFileName,
        `images/${fileName}`,
        mimeType
      );
      if (!name || !price || !mrp || !inStock || !isAvailable) {
        throw new Error(
          "Missing required fields: name, price, mrp, inStock, isAvailable."
        );
      }
      return Product.create({
        name: name,
        description: description,
        price: price,
        mrp: mrp,
        discount: discount,
        specification: specification,
        weight: weight,
        inStock: inStock,
        isAvailable: isAvailable,
        coupons: coupons,
        details: details,
        heroImg: attachmentData._id,
      });
    }
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    throw new Error(error.message || "Failed to create product");
  }
};

export const getProductByIDservice = async (id?: string) => {
  try {
    if (id) {
      if (!isValidObjectId(id)) {
        throw new Error("Invalid product ID format");
      }
      const product = await Product.findById(id);
      return product || null; // Return null if product not found
    }
    return await Product.find(); // Return all products if no ID is provided
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

export const updateProductService = async (
  id: string,
  updateData: Partial<IProduct>
) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid product ID format");
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return updatedProduct;
  } catch (error: any) {
    console.error("Error updating product:", error);
    throw new Error(error);
  }
};

export const deleteService = async (id: string) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid product ID format");
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error("Product not found");
    }

    return deletedProduct;
  } catch (error: any) {
    console.error("Error deleting product:", error);
    throw new Error(error.message);
  }
};
