import { Controller, Post } from "@overnightjs/core";
import resMiddlewareCommon from "../../../@utils/middlewares/resMiddleware";
import { Request, Response } from "express";
import { createChatSessionService } from "../../../services/chatSession.service";

@Controller("public/chatSession")
export class chatSessionController {
  @Post("create")
  async createchatSession(req: Request, res: Response) {
    try {
      const { user1_id, user2_id } = req.body;

      if (!user1_id || !user2_id) {
        return resMiddlewareCommon(res, false, "Missing required fields.");
      }

      const chatSession = await createChatSessionService(user1_id, user2_id);

      resMiddlewareCommon(
        res,
        true,
        "success: chatSession sent successfully...",
        chatSession
      );
    } catch (error: any) {
      console.error("Chat session creation error:", error.message);
      resMiddlewareCommon(
        res,
        false,
        "Error: chat session could not be created.",
        error.message
      );
    }
  }

  // //   @Delete("cancel/:orderId")
  // //   async cancelOrder(req: Request, res: Response) {
  // //     try {
  // //       const { orderId } = req.params;
  // //       const result = await cancelOrderService(orderId);
  // //       resMiddlewareCommon(res, true, "Order cancelled successfully", result);
  // //     } catch (error: any) {
  // //       resMiddlewareCommon(res, false, "Error cancelling order.");
  // //     }
  // //   }
}
