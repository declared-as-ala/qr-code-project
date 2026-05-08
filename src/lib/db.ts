import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDb() {
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in environment variables.");
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI as string, { dbName: "qr_menu_saas" });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
