import { Schema, model, models, Types } from "mongoose";

const ProductSchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: true, index: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true, index: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    badge: { type: String, enum: ["Nouveau", "Populaire", "Promo", ""], default: "" },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);
ProductSchema.index({ restaurantId: 1, sortOrder: 1 });

export const Product = models.Product || model("Product", ProductSchema);
