import { Controller, Get, Post , Delete} from "@overnightjs/core";
import resMiddlewareCommon from "../../../@utils/middlewares/resMiddleware";
import { Request, Response } from "express";
import { createMessageService, deleteMessageService } from "../../../services/mesaages.service";

@Controller("public2/message")
export class MessageController {
  @Post("create")
  async createMessage(req: Request, res: Response) {
    try {
      const { sender_id, receiver_id, text, status } = req.body;

      if (!sender_id || !receiver_id || !text) {
        return resMiddlewareCommon(res, false, "Missing required fields.");
      }

      const validStatus = ["sent", "delivered", "read"];
      const messageStatus = validStatus.includes(status) ? status : "sent";

      const message = await createMessageService({
        sender_id,
        receiver_id,
        text,
        status: messageStatus,
      });
      resMiddlewareCommon(
        res,
        true,
        "success: message sent successfully...",
        message
      );
    } catch (error: any) {
      resMiddlewareCommon(res, false, "error: message not send", error.message);
    }
  }

  @Delete("delete/:messageId")
  async deleteMessage(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const deleted = await deleteMessageService(messageId);
      resMiddlewareCommon(res, true, "Message deleted successfully", deleted);
    } catch (error: any) {
      resMiddlewareCommon(res, false, error.message);
    }
  }
}
