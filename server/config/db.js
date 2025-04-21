import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Завантаження змінних середовища

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI); // Підключення до MongoDB без старих параметрів
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Завершити процес у разі невдачі
  }
};

export default connectDB; // Використовуємо ES-модульний синтаксис
