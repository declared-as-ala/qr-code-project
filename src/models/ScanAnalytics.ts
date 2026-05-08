import { Schema, model, models, Types } from "mongoose";

const ScanAnalyticsSchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, ref: "Restaurant", required: true, index: true },
    productId: { type: Types.ObjectId, ref: "Product" },
    ipAddress: String,
    userAgent: String,
    scannedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);
ScanAnalyticsSchema.index({ restaurantId: 1, scannedAt: -1 });

export const ScanAnalytics = models.ScanAnalytics || model("ScanAnalytics", ScanAnalyticsSchema);
