import { Controller, Post, Get, Put, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import resMiddlewareCommon from "../../@utils/middlewares/resMiddleware";
import {
  addToCartService,
  getCartService,
  updateCartService,
  removeCartItemService,
  clearCartService,
} from "../../services/cart.service";

@Controller("public/cart")
export class CartController {
  @Post("add")
  async addToCart(req: Request, res: Response) {
    try {
      const { productId, quantity, userId } = req.body;

      if (!userId || !productId || !quantity) {
        return resMiddlewareCommon(res, false, "Missing required fields.");
      }
      if (typeof quantity !== "number" || quantity <= 0) {
        return resMiddlewareCommon(res, false, "Invalid quantity.");
      }

      const cart = await addToCartService(productId, quantity, userId);
      resMiddlewareCommon(res, true, "Item added to cart successfully", cart);
    } catch (error) {
      console.error("Error in addToCart:", error);
      resMiddlewareCommon(res, false, "Error adding to cart.");
    }
  }

  @Get("all")
  async getCartall(req: Request, res: Response) {
    try {
      const cart = await getCartService();
      
      if (!cart) {
        return resMiddlewareCommon(res, true, "Cart is empty.", { items: [] });
      }
      resMiddlewareCommon(res, true, "Cart fetched successfully", cart);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error fetching cart.");
    }
  }

  // GET cart items for a user
  @Get("id/:userId")
  async getCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return resMiddlewareCommon(res, false, "User ID is required.");
      }

      const cart = await getCartService(userId);
      if (!cart) {
        return resMiddlewareCommon(res, true, "Cart is empty.", { items: [] });
      }
      resMiddlewareCommon(res, true, "Cart fetched successfully", cart);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error fetching cart.");
    }
  }

  // UPDATE cart item quantity
  @Put("update")
  async updateCart(req: Request, res: Response) {
    try {
      const { userId, productId, quantity } = req.body;

      if (!userId || !productId || quantity === undefined) {
        return resMiddlewareCommon(res, false, "Missing required fields.");
      }

      const updatedCart = await updateCartService(userId, productId, quantity);

      if (!updatedCart) {
        return resMiddlewareCommon(res, false, "Cart not found.");
      }
      resMiddlewareCommon(res, true, "Cart updated successfully", updatedCart);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error updating cart.");
    }
  }

  // REMOVE item from cart
  @Delete("remove")
  async removeCartItem(req: Request, res: Response) {
    try {
      const { userId, productId } = req.body;

      if (!userId || !productId) {
        return resMiddlewareCommon(res, false, "Missing required fields.");
      }

      const updatedCart = await removeCartItemService(userId, productId);
      if (!updatedCart) {
        return resMiddlewareCommon(
          res,
          false,
          "Cart not found or item not present."
        );
      }
      resMiddlewareCommon(res, true, "Item removed from cart", updatedCart);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error removing item from cart.");
    }
  }

  // CLEAR entire cart
  @Delete("clear/:userId")
  async clearCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await clearCartService(userId);

      if (result.deletedCount === 0) {
        return resMiddlewareCommon(
          res,
          false,
          "No cart items found for this user."
        );
      }

      resMiddlewareCommon(res, true, "Cart cleared successfully", result);
    } catch (error: any) {
      resMiddlewareCommon(res, false, `Error clearing cart: ${error.message}`);
    }
  }
}
