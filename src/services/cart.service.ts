import { error, log } from "console";
import { Cart } from "../models/cart.model";
import { Types } from "mongoose";

export const addToCartService = async (
  productId: string,
  quantity: number,
  userId: string
) => {
  try {
    if (!Types.ObjectId.isValid(productId) || !Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid productId or userId");
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId: new Types.ObjectId(userId),
        items: [{ productId: new Types.ObjectId(productId), quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId: new Types.ObjectId(productId), quantity });
      }
    }

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error in addToCartService:", error);
    throw new Error("Error adding to cart: " + error);
  }
};

export const getCartService = async (userId?: string) => {
  try {
    if (!userId) {
      const cart = await Cart.find()
        .populate("items.productId")
        .lean();

      if (!cart) {
        return { message: "cart is Empty", items: [] };
      }
      return cart;
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
    const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) })
      .populate("items.productId")
      .lean();

    if (!cart) {
      return { message: "cart is Empty", items: [] };
    }
    return cart;
  } catch (error) {
    throw new Error("Error fetching cart: " + error);
  }
};

export const updateCartService = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  try {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid userId or productId.");
    }

    const cart = await Cart.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) return null;

    const itemindex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemindex === -1) {
      throw new Error("Product not found in cart.");
    }
    if (quantity > 0) {
      cart.items[itemindex].quantity = quantity;
    } else {
      cart.items.splice(itemindex, 1);
    }
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error updating cart: " + error);
  }
};

export const removeCartItemService = async (
  userId: string,
  productId: string
) => {
  try {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
      return { success: false, message: "Invalid userId or productId." };
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $pull: { items: { productId: new Types.ObjectId(productId) } } },
      { new: true }
    );
    if (!cart) return null;

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return { success: true, message: "Cart deleted as no items left." };
    }
    return { success: true, message: "Item removed from cart.", data: cart };
  } catch (error) {
    throw new Error("Error removing cart item: " + error);
  }
};

export const clearCartService = async (userId: string) => {
  try {
    
    return await Cart.deleteMany({ userId }); 
  } catch (error) {
    throw new Error(`Error clearing cart: ${(error as Error).message}`);
  }
};
