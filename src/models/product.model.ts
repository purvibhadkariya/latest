import { Document, Schema, model, Model } from "mongoose";
import { IAttachment } from "./attachment.model";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  heroImg: IAttachment;
  specification: string;
  weight: number;
  inStock: boolean;
  isAvailable: boolean;
  coupons: string[];
  details: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    heroImg: { type: Schema.Types.ObjectId, ref: "Attachment", index: true },
    specification: { type: String },
    weight: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    coupons: {
      type: [{ type: Schema.Types.ObjectId, ref: "Coupon" }],
      default: [],
    },
    details: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = model<IProduct>(
  "Product",
  ProductSchema
);
