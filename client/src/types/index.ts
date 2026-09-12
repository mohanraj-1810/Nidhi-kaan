export type ProjectType = 'Housing' | 'Road' | 'Bus Stand';
export type AuthenticityStatus = 'PENDING' | 'PASSED' | 'FAILED';
export type ProgressStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type GSTStatus = 'PENDING' | 'VALID' | 'FRAUD_FLAGGED';
export type EscalationLevel = 'LOCAL_STAFF' | 'DISTRICT' | 'STATE' | 'CM_DASHBOARD';

export interface CaseCreatePayload {
  project_type: ProjectType;
  beneficiary_contractor_id: string;
  claimed_stage: string;
  latitude: number;
  longitude: number;
  invoice_number?: string;
}

export interface CaseItem {
  id: string;
  project_type: ProjectType;
  beneficiary_contractor_id: string;
  claimed_stage: string;
  latitude: number | null;
  longitude: number | null;
  authenticity_status: AuthenticityStatus;
  progress_status: ProgressStatus;
  invoice_number: string | null;
  gst_status: GSTStatus;
  escalation_level: EscalationLevel;
  sla_timer_hours: number;
  is_escalated: boolean;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_cases: number;
  pending_inspections: number;
  fraud_flagged_count: number;
  escalated_count: number;
  cases_by_escalation_level: Record<EscalationLevel, number>;
}

export interface VerifyGSTResponse {
  id: string;
  invoice_number: string | null;
  gst_status: GSTStatus;
  message: string;
}

export interface FastForwardResponse {
  id: string;
  previous_escalation_level: EscalationLevel;
  new_escalation_level: EscalationLevel;
  is_escalated: boolean;
  updated_at: string;
}
