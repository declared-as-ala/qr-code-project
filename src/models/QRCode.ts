import { Schema, model, models, Types } from "mongoose";

const QRCodeSchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: true, unique: true },
    targetUrl: { type: String, required: true },
    qrImageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const QRCode = models.QRCode || model("QRCode", QRCodeSchema);
