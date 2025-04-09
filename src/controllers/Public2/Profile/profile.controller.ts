import { Controller, Post, Get, Middleware } from "@overnightjs/core";
import resMiddlewareCommon from "../../../@utils/middlewares/resMiddleware";
import { Request, Response } from "express";
import { Attachment } from "../../../models/attachment.model";
import { Profile } from "../../../models/profile.model";
import { intializeMulter } from "../../../services/multer.service";
import mongoose from "mongoose";

@Controller("public/profile")
export class ProfileController {
  @Post("create")
  @Middleware(intializeMulter())
  async createProfile(req: Request, res: Response) {
    try {
      console.log("Received body:", req.body);
      console.log("Received file:", req.file);

      const { userId, status_message, last_seen } = req.body;

      if (!userId) {
        return resMiddlewareCommon(res, false, "User ID is required");
      }

      let profile_pic_Id;

      if (req.file) {
        const attachment = await Attachment.create({
          filename: req.file.filename,
          url: req.file.path,
          type: req.file.mimetype,
        });
        profile_pic_Id = attachment._id;
      }

      const existingProfile = await Profile.findOne({ userId });

      if (existingProfile) {
        return resMiddlewareCommon(
          res,
          false,
          "Profile already exists for this user"
        );
      }

      const newProfile = await Profile.create({
        userId: new mongoose.Types.ObjectId(userId),
        profile_pic: profile_pic_Id,
        status_message,
        last_seen: last_seen ? new Date(last_seen) : undefined,
      });
      resMiddlewareCommon(res, true, "success: Profile sent successfully...");
    } catch (error: any) {
      resMiddlewareCommon(res, false, "error: Profile not send");
    }
  }
}

//   //   @Delete("cancel/:orderId")
//   //   async cancelOrder(req: Request, res: Response) {
//   //     try {
//   //       const { orderId } = req.params;
//   //       const result = await cancelOrderService(orderId);
//   //       resMiddlewareCommon(res, true, "Order cancelled successfully", result);
//   //     } catch (error: any) {
//   //       resMiddlewareCommon(res, false, "Error cancelling order.");
//   //     }
//   //   }
// }
