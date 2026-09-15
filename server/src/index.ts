import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/api';
import { AppError } from './utils/errors';
import { requestLogger } from './middleware/requestLogger';
import { swaggerUi, swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1', apiRouter);
app.get('/api-docs/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the merged React frontend in production. `client/dist` is resolved
// relative to this file, which works both from src/ (tsx dev) and dist/
// (compiled output). API routes are already mounted above, so every non-API
// GET falls back to the SPA's index.html.
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (
      req.method !== 'GET' ||
      req.path.startsWith('/api/') ||
      req.path.startsWith('/api-docs') ||
      req.path === '/health'
    ) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/v1`);
});

export default app;