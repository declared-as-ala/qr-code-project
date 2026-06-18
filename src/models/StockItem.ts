import { Schema, model, models, Types } from "mongoose";

const StockItemSchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: true, index: true },
    name:         { type: String, required: true },
    category:     { type: String, required: true },
    quantity:     { type: Number, required: true, default: 0 },
    unit:         { type: String, required: true },
    minThreshold: { type: Number, default: 0 },
    costPerUnit:  { type: Number, default: 0 },
    supplier:     String,
    notes:        String,
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const StockItem = models.StockItem || model("StockItem", StockItemSchema);
