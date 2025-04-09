import { Document, Schema, model, Model, Types } from "mongoose";

export interface IMessages extends Document {
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  text: string;
  status: "sent" | "delivered" | "read";
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export const Messages: Model<IMessages> = model<IMessages>(
  "Messages",
  MessageSchema
);
