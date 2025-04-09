import { Controller, Post, Get, Put, Delete } from "@overnightjs/core";
import { Request, Response } from "express";
import resMiddlewareCommon from "../../../@utils/middlewares/resMiddleware";
import {
  createCouponService,
  getCouponService,
  updateCouponService,
  deleteCouponService,
} from "../../../services/coupon.service";

@Controller("public/coupons")
export class CouponController {
  @Post("create")
  async createCoupon(req: Request, res: Response) {
    try {
      const { code, discount, category, expiryDate } = req.body;

      if (!code || !discount || !expiryDate) {
        return resMiddlewareCommon(res, false, "Missing required fields.");
      }

      const coupon = await createCouponService({
        code,
        discount,
        category,
        expiryDate,
      });
      resMiddlewareCommon(res, true, "Coupon created successfully", coupon);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error creating coupon.");
    }
  }

  @Get("all")
  async getCouponall(req: Request, res: Response) {
    try {
      const coupon = await getCouponService();
      resMiddlewareCommon(res, true, "Coupon fetched successfully", coupon);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error fetching coupon.");
    }
  }

  @Get("co/:code")
  async getCoupon(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const coupon = await getCouponService(code);
      resMiddlewareCommon(res, true, "Coupon fetched successfully", coupon);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error fetching coupon.");
    }
  }

  // UPDATE coupon
  @Put("update")
  async updateCoupon(req: Request, res: Response) {
    try {
      const { code, discount, expiryDate } = req.body;

      if (!code) {
        return resMiddlewareCommon(res, false, "Missing coupon code.");
      }

      const updatedCoupon = await updateCouponService(code, {
        discount,
        expiryDate,
      });
      resMiddlewareCommon(
        res,
        true,
        "Coupon updated successfully",
        updatedCoupon
      );
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error updating coupon.");
    }
  }

  // DELETE coupon
  @Delete("delete/:code")
  async deleteCoupon(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const result = await deleteCouponService(code);
      resMiddlewareCommon(res, true, "Coupon deleted successfully", result);
    } catch (error: any) {
      resMiddlewareCommon(res, false, "Error deleting coupon.");
    }
  }
}
