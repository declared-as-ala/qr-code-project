import { Schema, model, models, Types } from "mongoose";

const CategorySchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: true, index: true },
    name: { type: String, required: true },
    description: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
CategorySchema.index({ restaurantId: 1, sortOrder: 1 });

export const Category = models.Category || model("Category", CategorySchema);
