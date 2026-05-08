import { Schema, model, models, Types } from "mongoose";

const RestaurantSchema = new Schema(
  {
    ownerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    establishmentType: { type: String, enum: ["cafe", "restaurant"], default: "restaurant" },
    logo: String,
    coverImage: String,
    phone: String,
    address: String,
    instagram: String,
    facebook: String,
    googleMapsUrl: String,
    primaryColor: { type: String, default: "#B08D57" },
    secondaryColor: { type: String, default: "#F5E6CC" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Restaurant = models.Restaurant || model("Restaurant", RestaurantSchema);
