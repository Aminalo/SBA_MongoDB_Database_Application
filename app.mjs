import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './db.mjs';

import usersRouter from './routes/users.routes.mjs';
import projectsRouter from './routes/projects.routes.mjs';
import tasksRouter from './routes/tasks.routes.mjs';
import reportsRouter from './routes/reports.routes.mjs';
import { notFound, errorHandler } from './middleware/error.mjs';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, msg: 'SBA MongoDB Database Application API' }));

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/reports', reportsRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(port, () => console.log(`API running on :${port}`));
}).catch(err => {
  console.error('Failed to connect DB:', err);
  process.exit(1);
});