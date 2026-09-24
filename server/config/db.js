import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && mongoUri.trim() !== '') {
      try {
        const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log(`[Database] MongoDB Connected to remote host: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.warn(`[Database] Could not connect to provided MONGODB_URI: ${err.message}. Attempting fallback...`);
      }
    }

    // Fallback: Start In-Memory MongoDB instance with Debian 12 compatible binary version (>= 7.0.3)
    console.log('[Database] Starting In-Memory MongoDB instance...');
    mongoMemoryServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.3',
      },
    });
    const uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[Database] In-Memory MongoDB Server Connected at: ${uri}`);
  } catch (error) {
    console.error(`[Database Warning] In-memory Mongo setup failed: ${error.message}`);
    console.log(`[Database Notice] Please provide a valid MONGODB_URI (e.g. from MongoDB Atlas) in your Render environment variables.`);
  }
};
