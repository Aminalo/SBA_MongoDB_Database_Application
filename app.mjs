import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './db.mjs';
import usersRouter from './routes/users.routes.mjs';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, msg: 'SBA MongoDB Database Application API' }));

app.use('/api/users', usersRouter);

const port = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(port, () => console.log(`API running on :${port}`));
}).catch(err => {
  console.error('Failed to connect DB:', err);
  process.exit(1);
});