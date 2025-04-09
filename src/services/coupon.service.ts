import { Coupon } from "../models/coupons.model";

export const createCouponService = async (couponData: any) => {
  try {
    const coupon = new Coupon(couponData);
    await coupon.save();
    return coupon;
  } catch (error) {
    throw new Error("Error creating coupon: " + error);
  }
};

export const getCouponService = async (code?: string) => {
  try {
    if (code) {
      console.log(code);
      // return 
      const coupon = await Coupon.findOne({ code });
      return coupon || null; 
    }
    return await Coupon.find();
  } catch (error) {
    throw new Error("Error fetching coupon: " + error);
  }
};

export const updateCouponService = async (code: string, updateData: any) => {
  try {
    return await Coupon.findOneAndUpdate({ code }, updateData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Error updating coupon: " + error);
  }
};

export const deleteCouponService = async (code: string) => {
  try {
    return await Coupon.findOneAndDelete({ code });
  } catch (error) {
    throw new Error("Error deleting coupon: " + error);
  }
};
