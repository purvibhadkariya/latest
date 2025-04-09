import { Document, Schema, model, Model } from "mongoose";

export interface IOrders extends Document {
  productId: string;
  quantity: number;
  address: string;
  userId: string;
  date: Date;
  status: string;
}

const OrdersSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    // adress: { type: Schema.Types.ObjectId, ref: "Address", index: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Orders: Model<IOrders> = model<IOrders>("Orders", OrdersSchema);
