import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl_insightx';

  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB successfully connected to:', mongoUri);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB database connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB database connection disconnected.');
    });

    // Connect to database
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error);
    process.exit(1);
  }
};

export default connectDatabase;
