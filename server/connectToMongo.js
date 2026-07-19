import "server-only";
import mongoose from "mongoose";

const globalForMongoose = globalThis;

if (!globalForMongoose.__mongooseCache) {
  globalForMongoose.__mongooseCache = {
    connection: null,
    promise: null,
  };
}

const cache = globalForMongoose.__mongooseCache;

export async function connectToMongo() {
  if (cache.connection && mongoose.connection.readyState === 1) {
    return cache.connection;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is missing from the environment variables.",
    );
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10_000,
      })
      .then((mongooseInstance) => mongooseInstance.connection)
      .catch((error) => {
        cache.promise = null;
        throw error;
      });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}