import { Controller, Post, Get, Put, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import resMiddlewareCommon from "../../../@utils/middlewares/resMiddleware";
import {
  createOrderService,
  getOrderService,
  updateOrderService,
  cancelOrderService,
  getAllOrdersService,
} from "../../../services/order.service";

@Controller("public/orders")
export class OrderController {
  @Post("create")
  async createOrder(req: Request, res: Response) {
    try {
      const { productId, quantity, address, userId } = req.body;

      if (!userId || !productId || !quantity || !address) {
        return resMiddlewareCommon(res, false, "Missing required fields.");
      }

      const order = await createOrderService({
        productId,
        quantity,
        address,
        userId,
      });
      resMiddlewareCommon(res, true, "Order placed successfully", order);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error placing order.");
    }
  }

  // UPDATE order status
  @Put("update")
  async updateOrder(req: Request, res: Response) {
    try {
      const { orderId, status } = req.body;

      if (!orderId || !status) {
        return resMiddlewareCommon(res, false, "Missing required fields.");
      }

      const updatedOrder = await updateOrderService(orderId, status);
      if (!updatedOrder.success) {
        return resMiddlewareCommon(res, false, "order not found");
      }
      resMiddlewareCommon(
        res,
        true,
        "Order updated successfully",
        updatedOrder
      );
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error updating order.");
    }
  }

  // CANCEL order
  @Delete("cancel/:orderId")
  async cancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await cancelOrderService(orderId);
      resMiddlewareCommon(res, true, "Order cancelled successfully", result);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error cancelling order.");
    }
  }

  // GET all orders (Admin use case)
  @Get("all")
  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await getAllOrdersService();
      resMiddlewareCommon(res, true, "All orders fetched successfully", orders);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error fetching all orders.");
    }
  }

  @Get("id/:orderId")
  async getOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await getOrderService(orderId);
      resMiddlewareCommon(res, true, "Order fetched successfully", order);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error fetching order.");
    }
  }
}
