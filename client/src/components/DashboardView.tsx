import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Send,
  Building2,
  TrendingUp,
  MapPin,
  FileCheck2,
} from 'lucide-react';
import { DashboardStats, EscalationLevel } from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
  loading: boolean;
  onRefresh: () => void;
  onSelectCaseTab: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onRefresh,
  onSelectCaseTab,
}) => {
  const levels: { key: EscalationLevel; label: string; tamil: string; sla: string }[] = [
    { key: 'LOCAL_STAFF', label: 'Local Staff', tamil: 'உள்ளூர் ஊழியர்', sla: '24h SLA' },
    { key: 'DISTRICT', label: 'District Authority', tamil: 'மாவட்ட அதிகாரி', sla: '48h SLA' },
    { key: 'STATE', label: 'State Authority', tamil: 'மாநில அதிகாரி', sla: '72h SLA' },
    { key: 'CM_DASHBOARD', label: "CM's Dashboard", tamil: 'முதலமைச்சர் தரவுத்தளம்', sla: 'Final Review' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[rgba(237,227,208,0.1)] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest mb-1">
            TAMIL NADU STATE COMPLIANCE MONITOR
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-editorial text-[#ede3d0]">
            Autonomous Escalation &amp; Verification Pulse
          </h1>
          <p className="text-sm text-[#a8a29b] mt-1">
            Active monitoring across Municipal, Housing, and Urban Development tranches.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 border border-[rgba(237,227,208,0.2)] text-xs font-mono rounded hover:border-[#d9a15c] transition-colors"
          >
            {loading ? 'Refreshing...' : 'Refresh Metrics'}
          </button>
          <button
            onClick={onSelectCaseTab}
            className="px-5 py-2 bg-[#d9a15c] text-[#0f0e0d] font-semibold text-xs rounded hover:bg-[#c48e4b] transition-colors shadow-lg"
          >
            Open Inspector →
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="stitch-card p-6 stitch-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a8a29b] mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">Total Recorded Cases</span>
            <Building2 className="w-5 h-5 text-[#d9a15c]" />
          </div>
          <div>
            <div className="text-4xl font-mono font-bold text-[#ede3d0]">{stats.total_cases}</div>
            <div className="text-[11px] text-[#5c8a5c] mt-2 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> Scheme-wide intake active
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="stitch-card p-6 stitch-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a8a29b] mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">Pending Inspections</span>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <div className="text-4xl font-mono font-bold text-[#ede3d0]">
              {stats.pending_inspections}
            </div>
            <div className="text-[11px] text-[#a8a29b] mt-2 font-mono">
              Ground photos &amp; stages awaiting review
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="stitch-card p-6 stitch-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a8a29b] mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">GST Fraud Detected</span>
            <AlertTriangle className="w-5 h-5 text-[#c84b31]" />
          </div>
          <div>
            <div className="text-4xl font-mono font-bold text-[#c84b31]">
              {stats.fraud_flagged_count}
            </div>
            <div className="text-[11px] text-[#c84b31] mt-2 font-mono">
              Held disbursements &amp; tax alerts
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="stitch-card p-6 stitch-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a8a29b] mb-4">
            <span className="text-xs font-mono uppercase tracking-wider">Auto-Escalated</span>
            <Send className="w-5 h-5 text-[#d9a15c]" />
          </div>
          <div>
            <div className="text-4xl font-mono font-bold text-[#d9a15c]">
              {stats.escalated_count}
            </div>
            <div className="text-[11px] text-[#a8a29b] mt-2 font-mono">
              Crossed SLA timers without human delay
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Hierarchy Funnel */}
      <div className="stitch-card p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(237,227,208,0.1)] pb-4 mb-6">
          <div>
            <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest">
              AUTONOMOUS DISPATCH PIPELINE
            </div>
            <h2 className="text-xl font-editorial font-light text-[#ede3d0]">
              Cases by Authority Tier
            </h2>
          </div>
          <span className="text-xs text-[#a8a29b] font-mono">Deterministic State Machine Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {levels.map((lvl, idx) => {
            const count = stats.cases_by_escalation_level[lvl.key] || 0;
            const isCM = lvl.key === 'CM_DASHBOARD';

            return (
              <div
                key={lvl.key}
                className={`p-5 rounded border ${
                  isCM
                    ? 'border-[#d9a15c] bg-[#d9a15c]/10'
                    : 'border-[rgba(237,227,208,0.1)] bg-[#141312]'
                } flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-[#d9a15c]">
                      Tier 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[rgba(237,227,208,0.1)] text-[#a8a29b]">
                      {lvl.sla}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#ede3d0]">{lvl.label}</div>
                  <div className="font-tamil text-xs text-[#a8a29b]">{lvl.tamil}</div>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(237,227,208,0.08)] flex items-baseline justify-between">
                  <span className="text-2xl font-mono font-bold text-[#ede3d0]">{count}</span>
                  <span className="text-[11px] text-[#a8a29b] font-mono">active cases</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Pilot Highlight: Tirupur */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="stitch-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#d9a15c] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> PILOT DISTRICT FOCUS
            </div>
            <h3 className="text-lg font-bold text-[#ede3d0]">Tirupur Municipal Corporation</h3>
            <p className="text-xs text-[#a8a29b] mt-2 leading-relaxed">
              Monitoring ₹115.37 Cr Central Bus Stand redevelopment + ₹100 Cr Urban Road paving
              initiatives under GO Ms No.173.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-[rgba(237,227,208,0.1)] flex justify-between items-center text-xs font-mono">
            <span className="text-[#ede3d0]">Zone: West TN</span>
            <span className="text-[#d9a15c]">11.1085° N, 77.3411° E</span>
          </div>
        </div>

        <div className="stitch-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#d9a15c] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" /> REAL-TIME POLICY VERDICT RULES
            </div>
            <h3 className="text-lg font-bold text-[#ede3d0]">Automated Sanction Guardrails</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="bg-[#141312] p-3 border border-[rgba(237,227,208,0.08)] rounded">
                <span className="text-[#78be78] font-mono font-bold block mb-1">Pass Rule:</span>
                Authenticity ≥ 80% + Valid Stage Classification + Unflagged GST invoice.
              </div>
              <div className="bg-[#141312] p-3 border border-[rgba(237,227,208,0.08)] rounded">
                <span className="text-[#d9a15c] font-mono font-bold block mb-1">Escalate Rule:</span>
                SLA timeout exceeded or stage dispute automatically bumps case level.
              </div>
              <div className="bg-[#141312] p-3 border border-[rgba(237,227,208,0.08)] rounded">
                <span className="text-[#f87171] font-mono font-bold block mb-1">Lockout Rule:</span>
                Invoice flagged with 'FAKE' triggers immediate disbursement lock.
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[rgba(237,227,208,0.1)] text-[11px] text-[#a8a29b] font-mono flex items-center justify-between">
            <span>Direct Supabase Persistence Active</span>
            <span className="text-[#5c8a5c]">Section 65B Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
