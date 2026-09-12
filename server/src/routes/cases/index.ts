import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { caseService } from '../../services/caseService';
import {
  CaseCreateSchema,
  FastForwardRequestSchema,
  CaseResponseSchema,
  VerifyGSTResponseSchema,
  FastForwardResponseSchema,
} from '../../schemas';

const router = Router();

const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  req.body = result.data;
  next();
};

const validateParams = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  req.params = result.data as any;
  next();
};

const uuidSchema = z.string().uuid();

router.post(
  '/submit',
  validate(CaseCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const caseData = req.body;
      const newCase = await caseService.createCase(caseData);
      const validated = CaseResponseSchema.parse(newCase);
      res.status(201).json(validated);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:id/verify-gst',
  validateParams(z.object({ id: uuidSchema })),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await caseService.verifyGST(id);
      const validated = VerifyGSTResponseSchema.parse(result);
      res.json(validated);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:id/fast-forward',
  validateParams(z.object({ id: uuidSchema })),
  validate(FastForwardRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { rejection_reason } = req.body;
      const result = await caseService.fastForward(id, rejection_reason);
      const validated = FastForwardResponseSchema.parse(result);
      res.json(validated);
    } catch (error) {
      next(error);
    }
  }
);

export default router;