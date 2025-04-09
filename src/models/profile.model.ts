import { Document, Schema, model, Model, Types } from "mongoose";
import { IAttachment } from "./attachment.model";

export interface IProfile extends Document {
  userId: Types.ObjectId;
  profile_pic?: IAttachment;
  status_message?: string;
  last_seen?: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      unique: true,
      required: true,
    },
    profile_pic: {
      type: Schema.Types.ObjectId,
      ref: "Attachment",
      index: true,
    },
    status_message: { type: String, trim: true, default: "" },
    last_seen: { type: Date, default: () => Date.now() }, // Ensures runtime execution
  },
  { timestamps: true }
);

export const Profile: Model<IProfile> = model<IProfile>(
  "Profile",
  ProfileSchema
);
