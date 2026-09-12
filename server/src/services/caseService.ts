import { supabase, isSupabaseConfigured } from '../config/supabase';
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

// In-memory store fallback when live Supabase DB is not connected
const memoryCases: Map<string, CaseResponse> = new Map([
  [
    '550e8400-e29b-41d4-a716-446655440001',
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      project_type: 'Bus Stand',
      beneficiary_contractor_id: 'TN-TPR-BUS-2026-081',
      claimed_stage: 'Roof',
      latitude: 11.1085,
      longitude: 77.3411,
      authenticity_status: 'PASSED',
      progress_status: 'APPROVED',
      invoice_number: 'INV-2026-TN-TP-08842',
      gst_status: 'VALID',
      escalation_level: 'LOCAL_STAFF',
      sla_timer_hours: 38,
      is_escalated: false,
      rejection_reason: null,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  [
    '550e8400-e29b-41d4-a716-446655440002',
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      project_type: 'Road',
      beneficiary_contractor_id: 'TN-CON-ROAD-409',
      claimed_stage: 'Finishing',
      latitude: 11.102,
      longitude: 77.345,
      authenticity_status: 'PASSED',
      progress_status: 'REJECTED',
      invoice_number: 'INV-FAKE-9921',
      gst_status: 'FRAUD_FLAGGED',
      escalation_level: 'DISTRICT',
      sla_timer_hours: 12,
      is_escalated: true,
      rejection_reason: 'Recycled asphalt density below IRC standards; invoice number unverified on GSTN',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
]);

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
  async getAllCases(): Promise<CaseResponse[]> {
    if (!isSupabaseConfigured) {
      return Array.from(memoryCases.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as CaseResponse[]) ?? [];
    } catch {
      return Array.from(memoryCases.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  },

  async createCase(data: CaseCreate): Promise<CaseResponse> {
    const authenticityStatus = mockSystem1Verification(data.latitude, data.longitude);
    const progressStatus = mockSystem2Verification(data.claimed_stage);
    const gstStatus = checkGSTFraud(data.invoice_number ?? null);

    const newCase: CaseResponse = {
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

    if (!isSupabaseConfigured) {
      memoryCases.set(newCase.id, newCase);
      return newCase;
    }

    try {
      const { data: inserted, error } = await supabase
        .from('cases')
        .insert(newCase)
        .select()
        .single();

      if (error) throw error;
      return inserted as CaseResponse;
    } catch {
      memoryCases.set(newCase.id, newCase);
      return newCase;
    }
  },

  async getCaseById(id: string): Promise<CaseResponse | null> {
    if (!isSupabaseConfigured) {
      return memoryCases.get(id) ?? null;
    }

    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        return memoryCases.get(id) ?? null;
      }
      return data as CaseResponse;
    } catch {
      return memoryCases.get(id) ?? null;
    }
  },

  async verifyGST(id: string): Promise<VerifyGSTResponse> {
    const existingCase = await this.getCaseById(id);
    if (!existingCase) throw new AppError('Case not found', 404);

    const gstStatus = checkGSTFraud(existingCase.invoice_number);
    const message =
      gstStatus === 'FRAUD_FLAGGED'
        ? 'Fraudulent invoice detected'
        : 'GST verification passed';

    if (!isSupabaseConfigured) {
      existingCase.gst_status = gstStatus;
      existingCase.updated_at = new Date().toISOString();
      memoryCases.set(id, existingCase);
      return {
        id: existingCase.id,
        invoice_number: existingCase.invoice_number,
        gst_status: existingCase.gst_status,
        message,
      };
    }

    try {
      const { data, error } = await supabase
        .from('cases')
        .update({ gst_status: gstStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        invoice_number: data.invoice_number,
        gst_status: data.gst_status,
        message,
      };
    } catch {
      existingCase.gst_status = gstStatus;
      existingCase.updated_at = new Date().toISOString();
      memoryCases.set(id, existingCase);
      return {
        id: existingCase.id,
        invoice_number: existingCase.invoice_number,
        gst_status: existingCase.gst_status,
        message,
      };
    }
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

    if (!isSupabaseConfigured) {
      const updatedCase: CaseResponse = {
        ...existingCase,
        ...updates,
      };
      memoryCases.set(id, updatedCase);
      return {
        id: updatedCase.id,
        previous_escalation_level: previousLevel,
        new_escalation_level: updatedCase.escalation_level,
        is_escalated: updatedCase.is_escalated,
        updated_at: updatedCase.updated_at,
      };
    }

    try {
      const { data, error } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        previous_escalation_level: previousLevel,
        new_escalation_level: data.escalation_level,
        is_escalated: data.is_escalated,
        updated_at: data.updated_at,
      };
    } catch {
      const updatedCase: CaseResponse = {
        ...existingCase,
        ...updates,
      };
      memoryCases.set(id, updatedCase);
      return {
        id: updatedCase.id,
        previous_escalation_level: previousLevel,
        new_escalation_level: updatedCase.escalation_level,
        is_escalated: updatedCase.is_escalated,
        updated_at: updatedCase.updated_at,
      };
    }
  },

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    let cases: CaseResponse[] = [];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('cases').select('*');
        if (!error && data) {
          cases = data as CaseResponse[];
        } else {
          cases = Array.from(memoryCases.values());
        }
      } catch {
        cases = Array.from(memoryCases.values());
      }
    } else {
      cases = Array.from(memoryCases.values());
    }

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