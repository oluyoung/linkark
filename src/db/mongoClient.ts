import { MongoClient } from 'mongodb';

if (!process.env.MONGO_URL) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const MONGO_URL = process.env.MONGO_URL;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

type GlobalWithMongoClientPromise = typeof globalThis & {
  _mongoClientPromise: Promise<MongoClient>;
};

if (process.env.NODE_ENV === 'development') {
  if (!(global as GlobalWithMongoClientPromise)._mongoClientPromise) {
    client = new MongoClient(MONGO_URL, options);
    (global as GlobalWithMongoClientPromise)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as GlobalWithMongoClientPromise)._mongoClientPromise;
} else {
  client = new MongoClient(MONGO_URL, options);
  clientPromise = client.connect();
}

export default clientPromise;
