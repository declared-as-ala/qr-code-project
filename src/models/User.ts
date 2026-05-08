import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "restaurant_admin"], default: "restaurant_admin" },
    mustChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
