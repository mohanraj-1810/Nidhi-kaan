import { Router, Request, Response, NextFunction } from 'express';
import { caseService } from '../../services/caseService';
import { DashboardStatsResponseSchema } from '../../schemas';

const router = Router();

router.get(
  '/stats',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await caseService.getDashboardStats();
      const validated = DashboardStatsResponseSchema.parse(stats);
      res.json(validated);
    } catch (error) {
      next(error);
    }
  }
);

export default router;