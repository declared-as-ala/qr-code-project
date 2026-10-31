import { Schema, model, models } from "mongoose";

const ConversionEventSchema = new Schema(
  {
    eventType: { type: String, default: "whatsapp_click", index: true },
    pathname: { type: String, required: true, index: true },
    ctaLocation: { type: String, default: "general" },
    ctaLabel: { type: String, default: "" },
    href: { type: String, default: "" },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ConversionEvent =
  models.ConversionEvent || model("ConversionEvent", ConversionEventSchema);

