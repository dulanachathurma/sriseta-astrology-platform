import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export function isMongoConfigured() {
  const uri = process.env.MONGODB_URI || '';
  return (
    !!uri &&
    !uri.includes('your_mongodb_atlas') &&
    !uri.includes('ඔබගේPassword') &&
    !uri.includes('<password>') &&
    uri.startsWith('mongodb')
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
