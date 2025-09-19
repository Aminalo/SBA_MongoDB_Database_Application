import 'dotenv/config';
import mongoose from 'mongoose';
export async function connectDB() {
  const uri = process.env.MONGO_URI;              // <-- ton URL Atlas vient de .env
  const dbName = process.env.DB_NAME || 'sba_db'; // <-- nom de la DB
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri, { dbName });
  console.log('Mongo connected:', dbName);
}