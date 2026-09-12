import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  _res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = _res;
    console.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`);
  });

  next();
};