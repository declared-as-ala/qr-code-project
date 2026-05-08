import { auth } from "@/lib/auth";
import { Restaurant } from "@/models/Restaurant";
import { connectDb } from "@/lib/db";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

export async function requireRestaurant() {
  const user = await requireUser();
  await connectDb();
  const restaurant = await Restaurant.findOne({ ownerId: user.id });
  if (!restaurant && user.role !== "super_admin") throw new Error("Restaurant not found");
  return { user, restaurant };
}
