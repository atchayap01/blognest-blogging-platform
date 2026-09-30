import mongoose from 'mongoose';

let isAtlas = false;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in .env');
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);

    isAtlas = true;
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const getDbStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  isAtlas,
  databaseName: mongoose.connection.name || 'blognest',
  host: 'MongoDB Atlas (Cloud)',
});

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
};