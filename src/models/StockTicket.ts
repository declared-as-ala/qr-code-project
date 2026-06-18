import { Schema, model, models, Types } from "mongoose";

const TicketItemSchema = new Schema(
  {
    stockItemId: { type: Types.ObjectId, ref: "StockItem" },
    name:        { type: String, required: true },
    quantity:    { type: Number, required: true },
    unit:        { type: String, required: true },
  },
  { _id: false }
);

const StockTicketSchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: true, index: true },
    reference:    { type: String, required: true },
    items:        [TicketItemSchema],
    note:         String,
  },
  { timestamps: true }
);

export const StockTicket = models.StockTicket || model("StockTicket", StockTicketSchema);
