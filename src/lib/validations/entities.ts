import { z } from "zod";

export const restaurantSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  instagram: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  primaryColor: z.string().default("#B08D57"),
  secondaryColor: z.string().default("#F5E6CC"),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  image: z.string().optional(),
  badge: z.enum(["Nouveau", "Populaire", "Promo", ""]).default(""),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
});
