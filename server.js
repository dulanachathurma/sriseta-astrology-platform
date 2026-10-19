/**
 * Local Development API Server
 * Mirrors the Vercel /api serverless functions so you can test
 * register/login/horoscope without running `vercel dev`.
 *
 * Usage:  node server.js   (in a separate terminal while `npm run dev` runs)
 * Runs on http://localhost:3000
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import the same handlers used by Vercel
import registerHandler from './api/auth/register.js';
import loginHandler from './api/auth/login.js';
import generateHandler from './api/horoscope/generate.js';
import weeklyHoroscopeHandler from './api/weekly-horoscope.js';
import profileHandler from './api/user/profile.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Adapter: convert Express (req, res) to Vercel-style handler
function wrap(handler) {
  return (req, res) => handler(req, res);
}

// Auth routes
app.options('/api/auth/register', (_, res) => res.status(200).end());
app.post('/api/auth/register', wrap(registerHandler));

app.options('/api/auth/login', (_, res) => res.status(200).end());
app.post('/api/auth/login', wrap(loginHandler));

// Profile routes
app.options('/api/user/profile', (_, res) => res.status(200).end());
app.get('/api/user/profile', wrap(profileHandler));
app.post('/api/user/profile', wrap(profileHandler));

// Horoscope routes
app.options('/api/horoscope/generate', (_, res) => res.status(200).end());
app.post('/api/horoscope/generate', wrap(generateHandler));

// Weekly horoscope
app.get('/api/weekly-horoscope', wrap(weeklyHoroscopeHandler));

app.listen(PORT, () => {
  console.log(`\n✅ Local API server running at http://localhost:${PORT}`);
  console.log(`   Routes:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/horoscope/generate`);
  console.log(`\n   Keep this running alongside: npm run dev (port 5173)\n`);
});
