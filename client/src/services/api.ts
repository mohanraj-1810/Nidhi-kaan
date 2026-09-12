import {
  CaseCreatePayload,
  CaseItem,
  DashboardStats,
  VerifyGSTResponse,
  FastForwardResponse,
} from '../types';

const API_BASE = '/api/v1';

export const api = {
  // Fetch all cases
  async getCases(): Promise<CaseItem[]> {
    const res = await fetch(`${API_BASE}/cases`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to load cases (${res.status})`);
    }
    return res.json();
  },

  // Submit new case
  async submitCase(payload: CaseCreatePayload): Promise<CaseItem> {
    const res = await fetch(`${API_BASE}/cases/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to submit case (${res.status})`);
    }
    return res.json();
  },

  // Verify GST for a case
  async verifyGST(id: string): Promise<VerifyGSTResponse> {
    const res = await fetch(`${API_BASE}/cases/${id}/verify-gst`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to verify GST (${res.status})`);
    }
    return res.json();
  },

  // Fast-forward escalation level
  async fastForward(id: string, rejectionReason?: string): Promise<FastForwardResponse> {
    const res = await fetch(`${API_BASE}/cases/${id}/fast-forward`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rejectionReason ? { rejection_reason: rejectionReason } : {}),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fast forward case (${res.status})`);
    }
    return res.json();
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to load dashboard stats (${res.status})`);
    }
    return res.json();
  },
};
