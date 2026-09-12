import { z } from 'zod';

export const ProjectTypeEnum = z.enum(['Housing', 'Road', 'Bus Stand']);
export const AuthenticityStatusEnum = z.enum(['PENDING', 'PASSED', 'FAILED']);
export const ProgressStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
export const GSTStatusEnum = z.enum(['PENDING', 'VALID', 'FRAUD_FLAGGED']);
export const EscalationLevelEnum = z.enum([
  'LOCAL_STAFF',
  'DISTRICT',
  'STATE',
  'CM_DASHBOARD',
]);

export const CaseCreateSchema = z.object({
  project_type: ProjectTypeEnum,
  beneficiary_contractor_id: z.string().min(1),
  claimed_stage: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  invoice_number: z.string().optional(),
});

export const CaseResponseSchema = z.object({
  id: z.string().uuid(),
  project_type: ProjectTypeEnum,
  beneficiary_contractor_id: z.string(),
  claimed_stage: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  authenticity_status: AuthenticityStatusEnum,
  progress_status: ProgressStatusEnum,
  invoice_number: z.string().nullable(),
  gst_status: GSTStatusEnum,
  escalation_level: EscalationLevelEnum,
  sla_timer_hours: z.number().int(),
  is_escalated: z.boolean(),
  rejection_reason: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const FastForwardRequestSchema = z.object({
  rejection_reason: z.string().optional(),
});

export const DashboardStatsResponseSchema = z.object({
  total_cases: z.number().int(),
  pending_inspections: z.number().int(),
  fraud_flagged_count: z.number().int(),
  escalated_count: z.number().int(),
  cases_by_escalation_level: z.record(EscalationLevelEnum, z.number().int()),
});

export const VerifyGSTResponseSchema = z.object({
  id: z.string().uuid(),
  invoice_number: z.string().nullable(),
  gst_status: GSTStatusEnum,
  message: z.string(),
});

export const FastForwardResponseSchema = z.object({
  id: z.string().uuid(),
  previous_escalation_level: EscalationLevelEnum,
  new_escalation_level: EscalationLevelEnum,
  is_escalated: z.boolean(),
  updated_at: z.string().datetime(),
});

export type CaseCreate = z.infer<typeof CaseCreateSchema>;
export type CaseResponse = z.infer<typeof CaseResponseSchema>;
export type FastForwardRequest = z.infer<typeof FastForwardRequestSchema>;
export type DashboardStatsResponse = z.infer<typeof DashboardStatsResponseSchema>;
export type VerifyGSTResponse = z.infer<typeof VerifyGSTResponseSchema>;
export type FastForwardResponse = z.infer<typeof FastForwardResponseSchema>;
export type ProjectType = z.infer<typeof ProjectTypeEnum>;
export type AuthenticityStatus = z.infer<typeof AuthenticityStatusEnum>;
export type ProgressStatus = z.infer<typeof ProgressStatusEnum>;
export type GSTStatus = z.infer<typeof GSTStatusEnum>;
export type EscalationLevel = z.infer<typeof EscalationLevelEnum>;