import {
  Controller,
  Delete,
  Get,
  Middleware,
  Post,
  Put,
} from "@overnightjs/core";
import { Request, Response } from "express";
import resMiddlewareCommon from "../../../@utils/middlewares/resMiddleware";
import { intializeMulter } from "../../../services/multer.service";
import {
  createProductService,
  deleteService,
  getProductByIDservice,
  updateProductService,
} from "../../../services/product.service";

@Controller("public/products")
export class productController {
  @Post("create")
  @Middleware(intializeMulter())
  async createProduct(req: Request, res: Response) {
    try {
      console.log("Received body:", req.body);
      console.log("Received files:", req.files);

      if (!req.body?.data) {
        return resMiddlewareCommon(res, false, "Invalid request data");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(req.body.data);
      } catch (error) {
        return resMiddlewareCommon(
          res,
          false,
          "Invalid JSON format in request"
        );
      }

      console.log("Parsed Data:", parsedData); // Check parsed JSON

      const {
        name,
        description,
        price,
        mrp,
        discount,
        specification,
        weight,
        inStock,
        isAvailable,
        coupons,
        details,
      } = parsedData;

      if (!name || !price || !mrp || !inStock || !isAvailable) {
        return resMiddlewareCommon(res, false, "Missing required fields");
      }

      const data = await createProductService(
        req,
        name,
        description,
        price,
        mrp,
        discount,
        specification,
        weight,
        inStock,
        isAvailable,
        coupons,
        details
      );

      return resMiddlewareCommon(
        res,
        true,
        "Product created successfully",
        data
      );
    } catch (error: any) {
      console.error("Error in createProduct:", error.message);
      return resMiddlewareCommon(
        res,
        false,
        error.message || "Something went wrong. Please try again."
      );
    }
  }

  @Get("")
  async getProducts(req: Request, res: Response) {
    try {
      const products = await getProductByIDservice();
      if (!products) {
        return resMiddlewareCommon(res, false, "No products found.");
      }
      return resMiddlewareCommon(
        res,
        true,
        "Products fetched successfully",
        products
      );
    } catch (error: any) {
      console.error("Error in getProducts:", error);
      return resMiddlewareCommon(res, false, "Error fetching products.");
    }
  }

  @Get(":id")
  async getProductByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productById = await getProductByIDservice(id);
      if (!productById) {
        return resMiddlewareCommon(res, false, "Product not found.");
      }
      return resMiddlewareCommon(
        res,
        true,
        "Product fetched successfully",
        productById
      );
    } catch (error: any) {
      console.error("Error in getProductByID:", error);
      return resMiddlewareCommon(res, false, "Error fetching product.");
    }
  }

  @Put("update/:id")
  async updateProduct(req: Request, res: Response) {
    try {      
      const { id } = req.params;
      const updateData = await updateProductService(id, req.body);

      if (!updateData) {
        return resMiddlewareCommon(
          res,
          false,
          "Product not found or not updated."
        );
      }
      return resMiddlewareCommon(
        res,
        true,
        "Product updated successfully",
        updateData
      );
    } catch (error: any) {
      console.error("Error in updateProduct:", error);
      return resMiddlewareCommon(
        res,
        false,
        "Something went wrong. Please try again."
      );
    }
  }

  @Delete("delete/:id")
  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const delProduct = await deleteService(id);

      if (!delProduct) {
        return resMiddlewareCommon(
          res,
          false,
          "Product not found or not deleted."
        );
      }
      return resMiddlewareCommon(
        res,
        true,
        "Product deleted successfully",
        delProduct
      );
    } catch (error: any) {
      console.error("Error in deleteProduct:", error);
      return resMiddlewareCommon(
        res,
        false,
        "Something went wrong. Please try again."
      );
    }
  }
}
