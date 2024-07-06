'use server';

import mongoose from 'mongoose';

if (!process.env.MONGO_URL) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const MONGO_URL = process.env.MONGO_URL;

let cached: mongoose.Mongoose | null = (global as typeof globalThis & { mongoose: mongoose.Mongoose }).mongoose;

if (!cached) {
  cached = null;
}

const connect = async () => {
  if (cached) {
    return cached;
  }

  if (!cached) {
    const opts = {
      bufferCommands: false,
    };

    cached = await mongoose.connect(MONGO_URL, opts).then((mongoose) => {
      return mongoose;
    });
    (global as typeof globalThis & { mongoose: mongoose.Mongoose }).mongoose = cached as mongoose.Mongoose;
  }

  return cached;
};

export default connect;
