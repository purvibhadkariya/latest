import { Orders } from "../models/orders.model";
import mongoose from "mongoose";

export const createOrderService = async (orderData: any) => {
  try {
    const order = new Orders(orderData);
    await order.save();
    return order;
  } catch (error) {
    throw new Error("Error placing order: " + error);
  }
};

export const getOrderService = async (orderId: string) => {
  try {
    return await Orders.findById(orderId).populate("productId");
  } catch (error) {
    throw new Error("Error fetching order: " + error);
  }
};

export const updateOrderService = async (orderId: string, status: string) => {
  try {
    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return { success: false, message: "Invalid order ID." };
    }

    // Find and update order status
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return { success: false, message: "Order not found." };
    }

    return { success: true, data: updatedOrder };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, message: "Internal server error." };
  }
};


export const cancelOrderService = async (orderId: string) => {
  try {
    return await Orders.findByIdAndDelete(orderId);
  } catch (error) {
    throw new Error("Error cancelling order: " + error);
  }
};

export const getAllOrdersService = async () => {
  try {
    console.log("ddd");
    
    return await Orders.find()
  } catch (error) {
    throw new Error("Error fetching orders: " + error);
  }
};