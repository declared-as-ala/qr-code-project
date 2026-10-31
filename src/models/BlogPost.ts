import { Schema, model, models } from "mongoose";

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    category: { type: String, default: "Guide" },
    targetKeyword: { type: String, default: "" },
    searchIntent: { type: String, default: "Informationnel" },
    readingTime: { type: String, default: "6 min" },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
      index: true,
    },
    seoTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    indexable: { type: Boolean, default: true },
    includeInSitemap: { type: Boolean, default: true },
    ogImage: { type: String, default: "" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);

