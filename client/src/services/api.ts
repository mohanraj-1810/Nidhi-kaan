import {
  CaseCreatePayload,
  CaseItem,
  DashboardStats,
  VerifyGSTResponse,
  FastForwardResponse,
} from '../types';

const API_BASE = '/api/v1';

// Backend errors arrive as `{ error: string }` (AppError / global handler) or
// `{ errors: { [field]: string[] } }` (Zod validation). Normalize them to a
// readable message so callers never see `err.message === undefined`.
function extractErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const p = payload as Record<string, unknown>;
    if (typeof p.error === 'string') return p.error;
    if (p.errors && typeof p.errors === 'object') {
      const lines = Object.entries(p.errors as Record<string, unknown>).flatMap(
        ([field, msgs]) =>
          (Array.isArray(msgs) ? msgs : [msgs]).map((m) => `${field}: ${m}`)
      );
      if (lines.length > 0) return lines.join('; ');
    }
    if (typeof p.message === 'string') return p.message;
  }
  return fallback;
}

// Marks HTTP-level failures so callers can distinguish them from network errors
// (e.g. don't silently create a local mock case when the backend rejected input).
function apiError(payload: unknown, fallback: string, status: number): Error {
  const err = new Error(extractErrorMessage(payload, fallback)) as Error & {
    status?: number;
  };
  err.status = status;
  return err;
}

async function request<T>(path: string, init?: RequestInit, fallback = `Request failed`): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw apiError(payload, `${fallback} (${res.status})`, res.status);
  }
  return res.json();
}

export const api = {
  // Fetch all cases
  getCases(): Promise<CaseItem[]> {
    return request<CaseItem[]>('/cases', undefined, 'Failed to load cases');
  },

  // Submit new case
  submitCase(payload: CaseCreatePayload): Promise<CaseItem> {
    return request<CaseItem>(
      '/cases/submit',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      'Failed to submit case'
    );
  },

  // Verify GST for a case
  verifyGST(id: string): Promise<VerifyGSTResponse> {
    return request<VerifyGSTResponse>(
      `/cases/${id}/verify-gst`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      'Failed to verify GST'
    );
  },

  // Fast-forward escalation level
  fastForward(id: string, rejectionReason?: string): Promise<FastForwardResponse> {
    return request<FastForwardResponse>(
      `/cases/${id}/fast-forward`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rejectionReason ? { rejection_reason: rejectionReason } : {}),
      },
      'Failed to fast forward case'
    );
  },

  // Get dashboard statistics
  getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/dashboard/stats', undefined, 'Failed to load dashboard stats');
  },
};
