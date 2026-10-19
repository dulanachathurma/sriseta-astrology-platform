import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export function isMongoConfigured() {
  return (
    !!MONGODB_URI &&
    !MONGODB_URI.includes('your_mongodb_atlas') &&
    MONGODB_URI.startsWith('mongodb')
  );
}

/**
 * Global cached connection to avoid creating new connections on every
 * serverless function invocation (important for Vercel cold starts).
 */
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!isMongoConfigured()) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
