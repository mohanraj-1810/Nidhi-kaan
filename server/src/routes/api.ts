import { Router } from 'express';
import casesRouter from './cases';
import dashboardRouter from './dashboard';

const router = Router();

router.use('/cases', casesRouter);
router.use('/dashboard', dashboardRouter);

export default router;