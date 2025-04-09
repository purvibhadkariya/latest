import { Document, Schema, model, Model } from "mongoose";

export interface IAddress extends Document {
  flatNo: String;
  street: String;
  city: String;
  pincode: String;
  state: String;
  country: String;
}

const AddressSchema = new Schema(
  {
    flatNo: { type: String},
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

export const Address:Model<IAddress> = model<IAddress>("Address", AddressSchema);