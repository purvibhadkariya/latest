import { Document, Model, Schema, model } from "mongoose";

export interface IUser extends Document {
  userName: string;
  contact: string;
  password: string;
  refreshToken: string;
}

const userSchema = new Schema(
  {
    userName: { type: String, trim: true, unique: true, sparse: true },
    contact: { type: String, unique: true, trim: true, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
).index({ contact: 1 }, { sparse: true });

export const User: Model<IUser> = model<IUser>("User", userSchema);
