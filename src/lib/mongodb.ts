import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

/**
 * Connects to MongoDB if MONGODB_URI is set, otherwise returns null.
 * Returning null (rather than throwing) lets callers degrade gracefully:
 * the analyzer works without caching/history when no DB is configured.
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) return null;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
