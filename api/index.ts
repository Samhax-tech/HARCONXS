import express from 'express';
import { apiRouter } from '../src/server/apiRouter';

const app = express();

app.use('/api', apiRouter);

// Vercel Serverless Function Export
export default app;
