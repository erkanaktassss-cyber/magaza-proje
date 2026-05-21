import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import productionRoutes from './routes/production.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true, app: 'MES Node API' }));
app.use('/api/auth', authRoutes);
app.use('/api', productionRoutes);

app.listen(process.env.PORT || 4000, () => console.log('MES API running'));
