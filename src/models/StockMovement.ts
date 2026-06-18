import { Schema, model, models, Types } from "mongoose";

const StockMovementSchema = new Schema(
  {
    restaurantId:     { type: Types.ObjectId, ref: "Restaurant", required: true, index: true },
    stockItemId:      { type: Types.ObjectId, ref: "StockItem",  required: true },
    stockItemName:    { type: String, required: true },
    type:             { type: String, enum: ["entree", "sortie", "ajustement", "perte"], required: true },
    quantity:         { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity:      { type: Number, required: true },
    unit:             { type: String, required: true },
    note:             String,
  },
  { timestamps: true }
);

export const StockMovement = models.StockMovement || model("StockMovement", StockMovementSchema);
