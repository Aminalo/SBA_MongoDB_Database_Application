import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, msg: 'SBA MongoDB Database Application API' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on :${port}`));