import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import {
  CaseCreate,
  CaseResponse,
  AuthenticityStatus,
  ProgressStatus,
  GSTStatus,
  EscalationLevel,
  DashboardStatsResponse,
  VerifyGSTResponse,
  FastForwardResponse,
} from '../schemas';
import { AppError } from '../utils/errors';

const ESCALATION_ORDER: EscalationLevel[] = [
  'LOCAL_STAFF',
  'DISTRICT',
  'STATE',
  'CM_DASHBOARD',
];

function mockSystem1Verification(lat: number, long: number): AuthenticityStatus {
  if (lat === 0 && long === 0) return 'FAILED';
  return 'PASSED';
}

function mockSystem2Verification(claimedStage: string): ProgressStatus {
  const validStages = ['Foundation', 'Plinth', 'Roof', 'Finishing', 'Complete'];
  return validStages.includes(claimedStage) ? 'APPROVED' : 'REJECTED';
}

function checkGSTFraud(invoiceNumber: string | null): GSTStatus {
  if (!invoiceNumber) return 'PENDING';
  return invoiceNumber.toUpperCase().includes('FAKE') ? 'FRAUD_FLAGGED' : 'VALID';
}

function getNextEscalationLevel(current: EscalationLevel): EscalationLevel {
  const currentIndex = ESCALATION_ORDER.indexOf(current);
  if (currentIndex >= ESCALATION_ORDER.length - 1) {
    return 'CM_DASHBOARD';
  }
  return ESCALATION_ORDER[currentIndex + 1];
}

export const caseService = {
  async createCase(data: CaseCreate): Promise<CaseResponse> {
    const authenticityStatus = mockSystem1Verification(data.latitude, data.longitude);
    const progressStatus = mockSystem2Verification(data.claimed_stage);
    const gstStatus = checkGSTFraud(data.invoice_number ?? null);

    const newCase = {
      id: uuidv4(),
      project_type: data.project_type,
      beneficiary_contractor_id: data.beneficiary_contractor_id,
      claimed_stage: data.claimed_stage,
      latitude: data.latitude,
      longitude: data.longitude,
      authenticity_status: authenticityStatus,
      progress_status: progressStatus,
      invoice_number: data.invoice_number ?? null,
      gst_status: gstStatus,
      escalation_level: 'LOCAL_STAFF' as EscalationLevel,
      sla_timer_hours: 48,
      is_escalated: false,
      rejection_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error } = await supabase
      .from('cases')
      .insert(newCase)
      .select()
      .single();

    if (error) throw new AppError(`Failed to create case: ${error.message}`);
    return inserted as CaseResponse;
  },

  async getCaseById(id: string): Promise<CaseResponse | null> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new AppError(`Failed to fetch case: ${error.message}`);
    }
    return data as CaseResponse;
  },

  async verifyGST(id: string): Promise<VerifyGSTResponse> {
    const existingCase = await this.getCaseById(id);
    if (!existingCase) throw new AppError('Case not found', 404);

    const gstStatus = checkGSTFraud(existingCase.invoice_number);
    const message = gstStatus === 'FRAUD_FLAGGED'
      ? 'Fraudulent invoice detected'
      : 'GST verification passed';

    const { data, error } = await supabase
      .from('cases')
      .update({ gst_status: gstStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Failed to update GST status: ${error.message}`);

    return {
      id: data.id,
      invoice_number: data.invoice_number,
      gst_status: data.gst_status,
      message,
    };
  },

  async fastForward(id: string, rejectionReason?: string): Promise<FastForwardResponse> {
    const existingCase = await this.getCaseById(id);
    if (!existingCase) throw new AppError('Case not found', 404);

    const previousLevel = existingCase.escalation_level;
    const newLevel = getNextEscalationLevel(previousLevel);

    const updates: Partial<CaseResponse> = {
      escalation_level: newLevel,
      is_escalated: true,
      updated_at: new Date().toISOString(),
    };

    if (rejectionReason) {
      updates.rejection_reason = rejectionReason;
      updates.progress_status = 'REJECTED';
    }

    const { data, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Failed to escalate case: ${error.message}`);

    return {
      id: data.id,
      previous_escalation_level: previousLevel,
      new_escalation_level: data.escalation_level,
      is_escalated: data.is_escalated,
      updated_at: data.updated_at,
    };
  },

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const { data: cases, error } = await supabase.from('cases').select('*');

    if (error) throw new AppError(`Failed to fetch stats: ${error.message}`);

    const totalCases = cases.length;
    const pendingInspections = cases.filter(
      (c) => c.authenticity_status === 'PENDING' || c.progress_status === 'PENDING'
    ).length;
    const fraudFlaggedCount = cases.filter((c) => c.gst_status === 'FRAUD_FLAGGED').length;
    const escalatedCount = cases.filter((c) => c.is_escalated).length;

    const casesByEscalationLevel = ESCALATION_ORDER.reduce(
      (acc, level) => {
        acc[level] = cases.filter((c) => c.escalation_level === level).length;
        return acc;
      },
      {} as Record<EscalationLevel, number>
    );

    return {
      total_cases: totalCases,
      pending_inspections: pendingInspections,
      fraud_flagged_count: fraudFlaggedCount,
      escalated_count: escalatedCount,
      cases_by_escalation_level: casesByEscalationLevel,
    };
  },
};