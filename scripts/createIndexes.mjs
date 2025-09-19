import 'dotenv/config';
import mongoose from 'mongoose';

const dbName = process.env.DB_NAME || 'sba_db';

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { dbName });
  const db = mongoose.connection.db;

  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('projects').createIndex({ owner: 1, status: 1 });
  await db.collection('projects').createIndex({ createdAt: -1 });
  await db.collection('tasks').createIndex({ project: 1, status: 1 });
  await db.collection('tasks').createIndex({ assignee: 1, dueDate: 1 });
  await db.collection('tasks').createIndex({ title: 'text' });

  console.log('Indexes created.');
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });