import { Schema, model, models } from "mongoose";

const SeoPageConfigSchema = new Schema(
  {
    path: { type: String, required: true, unique: true, index: true },
    seoTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    indexable: { type: Boolean, default: true },
    includeInSitemap: { type: Boolean, default: true },
    ogImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SeoPageConfig =
  models.SeoPageConfig || model("SeoPageConfig", SeoPageConfigSchema);

