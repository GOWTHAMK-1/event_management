import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      try {
        const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`[Database] Could not connect to provided MONGODB_URI. Falling back to in-memory MongoDB.`);
      }
    }

    // Fallback: Start In-Memory MongoDB instance for quick local demonstration
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[Database] In-Memory MongoDB Server Started & Connected at: ${uri}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};
