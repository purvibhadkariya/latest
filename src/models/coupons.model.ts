import { Document, Schema, model, Model, Types } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discount: number;
  expiryDate: Date;
  minPurchase?: number;
  maxDiscount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> = model<ICoupon>("Coupon", CouponSchema);
