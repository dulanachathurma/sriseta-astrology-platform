import express from 'express';
import cors from 'cors';

export function apiDevPlugin() {
  const app = express();
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  app.post('/api/auth/register', async (req, res, next) => {
    try {
      const { default: handler } = await import('./api/auth/register.js');
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const { default: handler } = await import('./api/auth/login.js');
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/horoscope/generate', async (req, res, next) => {
    try {
      const { default: handler } = await import('./api/horoscope/generate.js');
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  });

  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(app);
    },
  };
}
