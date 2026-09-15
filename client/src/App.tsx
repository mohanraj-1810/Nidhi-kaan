import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { CaseInspectorView } from './components/CaseInspectorView';
import { NewCaseModal } from './components/NewCaseModal';
import { GSTVerificationView } from './components/GSTVerificationView';
import { api } from './services/api';
import { CaseItem, DashboardStats, CaseCreatePayload } from './types';

// Mirrors the backend's caseService memory-store derivation exactly so that the
// UI shows identical data whether the Express API is online or the app is
// running in mock/offline mode.
const initialMockStats: DashboardStats = {
  total_cases: 2,
  pending_inspections: 0,
  fraud_flagged_count: 1,
  escalated_count: 1,
  cases_by_escalation_level: {
    LOCAL_STAFF: 1,
    DISTRICT: 1,
    STATE: 0,
    CM_DASHBOARD: 0,
  },
};

// Seed cases mirror the backend's caseService memory store exactly.
const seedCases: CaseItem[] = [
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
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landing' | 'cases' | 'submit' | 'dashboard' | 'gst'>('landing');
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nidhi_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });
  const [serverOnline, setServerOnline] = useState<boolean>(false);
  const [stats, setStats] = useState<DashboardStats>(initialMockStats);
  const [cases, setCases] = useState<CaseItem[]>(seedCases);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(seedCases[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Sync theme to <html> class
  useEffect(() => {
    localStorage.setItem('nidhi_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check backend health & fetch stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      const liveStats = await api.getDashboardStats();
      setStats(liveStats);
      setServerOnline(true);
    } catch {
      // Backend not running or still starting
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch live cases from backend
  const fetchCases = async () => {
    try {
      const liveCases = await api.getCases();
      if (liveCases.length > 0) {
        setCases(liveCases);
        setSelectedCase(liveCases[0]);
      }
    } catch {
      // Keep seed cases as fallback when backend offline
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCases();
  }, []);

  // Handle case submission via API
  const handleCaseSubmit = async (payload: CaseCreatePayload) => {
    setActionLoading(true);
    try {
      const newCase = await api.submitCase(payload);
      setCases((prev) => [newCase, ...prev]);
      setSelectedCase(newCase);
      setServerOnline(true);
      fetchStats();
    } catch (err) {
      // Backend rejected the request (validation/conflict) — surface the real
      // message so the New Case form can show it, instead of fabricating a case.
      if ((err as { status?: number })?.status) throw err;
      // Network failure (backend offline) — fall back to local mock
      const mockNew: CaseItem = {
        id: crypto.randomUUID(),
        project_type: payload.project_type,
        beneficiary_contractor_id: payload.beneficiary_contractor_id,
        claimed_stage: payload.claimed_stage,
        latitude: payload.latitude,
        longitude: payload.longitude,
        authenticity_status: payload.latitude === 0 && payload.longitude === 0 ? 'FAILED' : 'PASSED',
        progress_status: ['Foundation', 'Plinth', 'Roof', 'Finishing', 'Complete'].includes(payload.claimed_stage)
          ? 'APPROVED'
          : 'REJECTED',
        invoice_number: payload.invoice_number ?? null,
        gst_status: payload.invoice_number?.toUpperCase().includes('FAKE')
          ? 'FRAUD_FLAGGED'
          : payload.invoice_number
          ? 'VALID'
          : 'PENDING',
        escalation_level: 'LOCAL_STAFF',
        sla_timer_hours: 48,
        is_escalated: false,
        rejection_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCases((prev) => [mockNew, ...prev]);
      setSelectedCase(mockNew);
      // Adjust local stats
      setStats((prev) => ({
        ...prev,
        total_cases: prev.total_cases + 1,
        fraud_flagged_count:
          mockNew.gst_status === 'FRAUD_FLAGGED'
            ? prev.fraud_flagged_count + 1
            : prev.fraud_flagged_count,
      }));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle GST verification for a case
  const handleVerifyGST = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await api.verifyGST(id);
      setCases((prev) =>
        prev.map((c) => (c.id === id ? { ...c, gst_status: res.gst_status } : c))
      );
      if (selectedCase?.id === id) {
        setSelectedCase((prev) => (prev ? { ...prev, gst_status: res.gst_status } : null));
      }
      fetchStats();
    } catch {
      // Network failure (backend offline) — keep a consistent local verdict
      setCases((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            const isFraud = c.invoice_number?.toUpperCase().includes('FAKE') ?? false;
            const updated = {
              ...c,
              gst_status: (isFraud ? 'FRAUD_FLAGGED' : 'VALID') as any,
            };
            if (selectedCase?.id === id) setSelectedCase(updated);
            return updated;
          }
          return c;
        })
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Handle fast-forward escalation
  const handleFastForward = async (id: string, reason?: string) => {
    setActionLoading(true);
    const escalationLevels = ['LOCAL_STAFF', 'DISTRICT', 'STATE', 'CM_DASHBOARD'] as const;

    try {
      const res = await api.fastForward(id, reason);
      setCases((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                escalation_level: res.new_escalation_level,
                is_escalated: true,
                rejection_reason: reason ?? c.rejection_reason,
              }
            : c
        )
      );
      if (selectedCase?.id === id) {
        setSelectedCase((prev) =>
          prev
            ? {
                ...prev,
                escalation_level: res.new_escalation_level,
                is_escalated: true,
                rejection_reason: reason ?? prev.rejection_reason,
              }
            : null
        );
      }
      fetchStats();
    } catch {
      // Network failure (backend offline) — fall back to local progression
      setCases((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            const curIdx = escalationLevels.indexOf(c.escalation_level);
            const nextLevel =
              curIdx >= escalationLevels.length - 1
                ? 'CM_DASHBOARD'
                : escalationLevels[curIdx + 1];
            const updated = {
              ...c,
              escalation_level: nextLevel,
              is_escalated: true,
              rejection_reason: reason ?? c.rejection_reason,
              progress_status: reason ? ('REJECTED' as const) : c.progress_status,
            };
            if (selectedCase?.id === id) setSelectedCase(updated);
            return updated;
          }
          return c;
        })
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-250">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        serverOnline={serverOnline}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {activeTab === 'landing' && (
          <LandingView
            onExploreCases={() => setActiveTab('cases')}
            onOpenSubmit={() => setActiveTab('submit')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            loading={loading}
            onRefresh={fetchStats}
            onSelectCaseTab={() => setActiveTab('cases')}
          />
        )}

        {activeTab === 'cases' && (
          <CaseInspectorView
            cases={cases}
            selectedCase={selectedCase}
            onSelectCase={(c) => setSelectedCase(c)}
            onVerifyGST={handleVerifyGST}
            onFastForward={handleFastForward}
            loading={loading}
            actionLoading={actionLoading}
          />
        )}

        {activeTab === 'submit' && (
          <NewCaseModal
            onSubmit={handleCaseSubmit}
            loading={actionLoading}
            onSuccessNavigate={() => setActiveTab('cases')}
          />
        )}

        {activeTab === 'gst' && <GSTVerificationView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs py-8 text-[var(--text-muted)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-tamil text-sm font-bold text-[var(--text-primary)]">நிதி கண்</span>
            <span>•</span>
            <span>GIGW Compliant Prototype</span>
            <span>•</span>
            <span>Government of Tamil Nadu</span>
          </div>
          <div className="font-mono text-[11px] text-[var(--accent-mint)] font-medium">
            Connected to Express API (/api/v1) &amp; Supabase PostgreSQL
          </div>
        </div>
      </footer>
    </div>
  );
};
