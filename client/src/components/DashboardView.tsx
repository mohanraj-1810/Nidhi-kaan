import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import {
  AlertTriangle,
  Clock,
  Send,
  Building2,
  TrendingUp,
  MapPin,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { DashboardStats, EscalationLevel } from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
  loading: boolean;
  onRefresh: () => void;
  onSelectCaseTab: () => void;
}

// Animated stat counter card
const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  sub: string;
  delay?: number;
}> = ({ label, value, icon, color = '#ede3d0', sub, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 700,
        delay,
        easing: 'easeOutExpo',
      });
    }
    if (numRef.current) {
      const el = numRef.current;
      const obj = { val: 0 };
      anime({
        targets: obj,
        val: value,
        duration: 1200,
        delay: delay + 300,
        easing: 'easeOutExpo',
        round: 1,
        update() { el.textContent = obj.val.toString(); },
      });
    }
  }, [value, delay]);

  return (
    <div
      ref={cardRef}
      className="stitch-card p-6 flex flex-col justify-between opacity-0
                 hover:border-[#d9a15c]/30 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between text-[#a8a29b] mb-4">
        <span className="text-xs font-mono uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div>
        <div className="text-4xl font-mono font-bold" style={{ color }}>
          <span ref={numRef}>0</span>
        </div>
        <div className="text-[11px] text-[#a8a29b] mt-2 font-mono">{sub}</div>
      </div>
    </div>
  );
};

// Escalation tier row bar
const TierBar: React.FC<{ count: number; max: number; delay: number }> = ({
  count,
  max,
  delay,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = max > 0 ? (count / max) * 100 : 0;

  useEffect(() => {
    if (!barRef.current) return;
    anime({
      targets: barRef.current,
      width: [`0%`, `${pct}%`],
      duration: 1000,
      delay,
      easing: 'easeOutExpo',
    });
  }, [pct, delay]);

  return (
    <div className="mt-3 w-full bg-[#0f0e0d] h-1 rounded overflow-hidden">
      <div
        ref={barRef}
        className="bg-gradient-to-r from-[#d9a15c] to-[#f7bb74] h-full rounded"
        style={{ width: '0%' }}
      />
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onRefresh,
  onSelectCaseTab,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const funnelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const levels: { key: EscalationLevel; label: string; tamil: string; sla: string }[] = [
    { key: 'LOCAL_STAFF', label: 'Local Staff', tamil: 'உள்ளூர் ஊழியர்', sla: '24h SLA' },
    { key: 'DISTRICT', label: 'District Authority', tamil: 'மாவட்ட அதிகாரி', sla: '48h SLA' },
    { key: 'STATE', label: 'State Authority', tamil: 'மாநில அதிகாரி', sla: '72h SLA' },
    { key: 'CM_DASHBOARD', label: "CM's Dashboard", tamil: 'முதலமைச்சர் தரவுத்தளம்', sla: 'Final Review' },
  ];

  const maxCount = Math.max(
    ...levels.map((l) => stats.cases_by_escalation_level[l.key] || 0),
    1
  );

  useEffect(() => {
    if (headerRef.current) {
      anime({
        targets: headerRef.current.querySelectorAll('.header-anim'),
        opacity: [0, 1],
        translateY: [-16, 0],
        delay: anime.stagger(80),
        duration: 600,
        easing: 'easeOutExpo',
      });
    }
    if (funnelRef.current) {
      anime({
        targets: funnelRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
        delay: 500,
        easing: 'easeOutExpo',
      });
    }
    if (bottomRef.current) {
      anime({
        targets: bottomRef.current.querySelectorAll('.bottom-card'),
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100, { start: 700 }),
        duration: 600,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-center justify-between border-b border-[rgba(237,227,208,0.1)] pb-6 gap-4"
      >
        <div>
          <div className="header-anim opacity-0 flex items-center gap-3 mb-1">
            <img
              src="/lady-justice.webp"
              alt="Nidhi Kaan"
              className="w-8 h-8 rounded-full object-cover border border-[#d9a15c]/40"
              style={{ filter: 'sepia(20%) brightness(0.9)' }}
            />
            <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest">
              TAMIL NADU STATE COMPLIANCE MONITOR
            </div>
          </div>
          <h1 className="header-anim opacity-0 text-3xl sm:text-4xl font-light font-editorial text-[#ede3d0]">
            Autonomous Escalation &amp; Verification Pulse
          </h1>
          <p className="header-anim opacity-0 text-sm text-[#a8a29b] mt-1">
            Active monitoring across Municipal, Housing, and Urban Development tranches.
          </p>
        </div>
        <div className="header-anim opacity-0 flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 border border-[rgba(237,227,208,0.2)] text-xs font-mono rounded
                       hover:border-[#d9a15c] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Metrics'}
          </button>
          <button
            onClick={onSelectCaseTab}
            className="px-5 py-2 bg-[#d9a15c] text-[#0f0e0d] font-semibold text-xs rounded
                       hover:bg-[#c48e4b] active:scale-95 transition-all shadow-lg"
          >
            Open Inspector →
          </button>
        </div>
      </div>

      {/* Animated Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Recorded Cases"
          value={stats.total_cases}
          icon={<Building2 className="w-5 h-5 text-[#d9a15c]" />}
          sub="Scheme-wide intake active"
          delay={0}
        />
        <StatCard
          label="Pending Inspections"
          value={stats.pending_inspections}
          icon={<Clock className="w-5 h-5 text-yellow-400" />}
          color="#facc15"
          sub="Ground photos & stages awaiting review"
          delay={80}
        />
        <StatCard
          label="GST Fraud Detected"
          value={stats.fraud_flagged_count}
          icon={<AlertTriangle className="w-5 h-5 text-[#c84b31]" />}
          color="#c84b31"
          sub="Held disbursements & tax alerts"
          delay={160}
        />
        <StatCard
          label="Auto-Escalated"
          value={stats.escalated_count}
          icon={<Send className="w-5 h-5 text-[#d9a15c]" />}
          color="#d9a15c"
          sub="Crossed SLA timers without human delay"
          delay={240}
        />
      </div>

      {/* Escalation Funnel */}
      <div ref={funnelRef} className="stitch-card p-8 opacity-0">
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
                className={`p-5 rounded border flex flex-col justify-between ${
                  isCM
                    ? 'border-[#d9a15c] bg-[#d9a15c]/10'
                    : 'border-[rgba(237,227,208,0.1)] bg-[#141312]'
                }`}
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
                  <TierBar count={count} max={maxCount} delay={600 + idx * 120} />
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(237,227,208,0.08)] flex items-baseline justify-between">
                  <span className="text-2xl font-mono font-bold text-[#ede3d0]">{count}</span>
                  <span className="text-[11px] text-[#a8a29b] font-mono">active cases</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Cards */}
      <div ref={bottomRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bottom-card opacity-0 stitch-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#d9a15c] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> PILOT DISTRICT FOCUS
            </div>
            <h3 className="text-lg font-bold text-[#ede3d0]">Tirupur Municipal Corporation</h3>
            <p className="text-xs text-[#a8a29b] mt-2 leading-relaxed">
              Monitoring ₹115.37 Cr Central Bus Stand redevelopment + ₹100 Cr Urban Road paving
              under GO Ms No.173.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-[rgba(237,227,208,0.1)] flex justify-between items-center text-xs font-mono">
            <span className="text-[#ede3d0]">Zone: West TN</span>
            <span className="text-[#d9a15c]">11.1085° N, 77.3411° E</span>
          </div>
        </div>

        <div className="bottom-card opacity-0 stitch-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#d9a15c] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" /> REAL-TIME POLICY VERDICT RULES
            </div>
            <h3 className="text-lg font-bold text-[#ede3d0]">Automated Sanction Guardrails</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="bg-[#141312] p-3 border border-[rgba(237,227,208,0.08)] rounded">
                <span className="text-[#78be78] font-mono font-bold block mb-1">Pass Rule:</span>
                Authenticity ≥ 80% + Valid Stage + Unflagged GST invoice.
              </div>
              <div className="bg-[#141312] p-3 border border-[rgba(237,227,208,0.08)] rounded">
                <span className="text-[#d9a15c] font-mono font-bold block mb-1">Escalate Rule:</span>
                SLA timeout exceeded or stage dispute bumps case level automatically.
              </div>
              <div className="bg-[#141312] p-3 border border-[rgba(237,227,208,0.08)] rounded">
                <span className="text-[#f87171] font-mono font-bold block mb-1">Lockout Rule:</span>
                Invoice flagged 'FAKE' triggers immediate disbursement lock.
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[rgba(237,227,208,0.1)] text-[11px] text-[#a8a29b] font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <img src="/lady-justice.webp" alt="" className="w-5 h-5 rounded-full object-cover opacity-60" />
              Nidhi Kaan Evidence Engine Active
            </span>
            <span className="text-[#5c8a5c]">Section 65B Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
