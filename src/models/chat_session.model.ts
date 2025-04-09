import { Document, Schema, model, Model, Types } from "mongoose";

export interface IChatSession extends Document {
  user1_id: Types.ObjectId;
  user2_id: Types.ObjectId;
  messages: Types.ObjectId[];
}

const ChatSessionSchema = new Schema(
  {
    user1_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    user2_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Messages", 
        // required: true,
        index: true,
      },
    ],
  },
  { timestamps: true }
);

export const ChatSession: Model<IChatSession> = model<IChatSession>(
  "ChatSession",
  ChatSessionSchema
);
