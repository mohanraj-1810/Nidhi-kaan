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
}> = ({ label, value, icon, color, sub, delay = 0 }) => {
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
                 hover:border-[#8BF497] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between text-[var(--text-muted)] mb-4">
        <span className="text-xs font-mono uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div>
        <div className="text-4xl font-mono font-bold" style={{ color: color || 'var(--text-primary)' }}>
          <span ref={numRef}>0</span>
        </div>
        <div className="text-[11px] text-[var(--text-muted)] mt-2 font-mono">{sub}</div>
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
    <div className="mt-3 w-full bg-[var(--bg-subtle)] h-1.5 rounded overflow-hidden border border-[var(--border-subtle)]/40">
      <div
        ref={barRef}
        className="bg-gradient-to-r from-[#8BF497] to-[#C1E4F9] h-full rounded"
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
        translateY: [20, 0],
        delay: anime.stagger(80),
        duration: 600,
        easing: 'easeOutExpo',
      });
    }
    if (funnelRef.current) {
      anime({
        targets: funnelRef.current,
        opacity: [0, 1],
        translateY: [24, 0],
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
        className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--border-subtle)] pb-6 gap-4"
      >
        <div>
          <div className="header-anim opacity-0 flex items-center gap-3 mb-1">
            <img
              src="/lady-justice-avatar.jpg"
              alt="Lady of Justice Seal"
              className="w-8 h-8 rounded-full object-cover border border-[#8BF497]/60"
            />
            <div className="text-[11px] font-mono text-[var(--accent-mint)] uppercase tracking-widest font-bold">
              TAMIL NADU STATE COMPLIANCE MONITOR
            </div>
          </div>
          <h1 className="header-anim opacity-0 text-3xl sm:text-4xl font-light font-editorial text-[var(--text-primary)]">
            Autonomous Escalation &amp; Verification Pulse
          </h1>
          <p className="header-anim opacity-0 text-sm text-[var(--text-muted)] mt-1">
            Active monitoring across Municipal, Housing, and Urban Development tranches.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="header-anim opacity-0 flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded text-xs text-[var(--text-primary)]
                       hover:border-[#8BF497] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#8BF497]' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Metrics'}
          </button>
          <button
            onClick={onSelectCaseTab}
            className="px-5 py-2 bg-[#8BF497] text-[#000000] font-bold text-xs rounded
                       hover:bg-[#78e385] active:scale-95 transition-all shadow-md cursor-pointer"
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
          icon={<Building2 className="w-5 h-5 text-[var(--accent-mint)]" />}
          sub="Scheme-wide intake active"
          delay={0}
        />
        <StatCard
          label="Pending Inspections"
          value={stats.pending_inspections}
          icon={<Clock className="w-5 h-5 text-[var(--accent-ice)]" />}
          color="var(--accent-ice)"
          sub="Ground photos & stages awaiting review"
          delay={80}
        />
        <StatCard
          label="GST Fraud Detected"
          value={stats.fraud_flagged_count}
          icon={<AlertTriangle className="w-5 h-5 text-[#f87171]" />}
          color="#f87171"
          sub="Held disbursements & tax alerts"
          delay={160}
        />
        <StatCard
          label="Auto-Escalated"
          value={stats.escalated_count}
          icon={<Send className="w-5 h-5 text-[var(--accent-mint)]" />}
          color="var(--accent-mint)"
          sub="Crossed SLA timers without human delay"
          delay={240}
        />
      </div>

      {/* Escalation Funnel */}
      <div ref={funnelRef} className="stitch-card p-8 opacity-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
          <div>
            <div className="text-[11px] font-mono text-[var(--accent-mint)] uppercase tracking-widest font-bold">
              AUTONOMOUS DISPATCH PIPELINE
            </div>
            <h2 className="text-xl font-editorial font-light text-[var(--text-primary)]">
              Cases by Authority Tier
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">Deterministic State Machine Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {levels.map((lvl, idx) => {
            const count = stats.cases_by_escalation_level[lvl.key] || 0;
            const isCM = lvl.key === 'CM_DASHBOARD';
            return (
              <div
                key={lvl.key}
                className={`p-5 rounded border flex flex-col justify-between transition-all ${
                  isCM
                    ? 'border-[#8BF497] bg-[#8BF497]/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-[var(--accent-mint)] font-bold">
                      Tier 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-card)]">
                      {lvl.sla}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[var(--text-primary)]">{lvl.label}</div>
                  <div className="font-tamil text-xs text-[var(--text-muted)]">{lvl.tamil}</div>
                  <TierBar count={count} max={maxCount} delay={600 + idx * 120} />
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-baseline justify-between">
                  <span className="text-2xl font-mono font-bold text-[var(--text-primary)]">{count}</span>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">active cases</span>
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
            <div className="text-[10px] font-mono text-[var(--accent-mint)] uppercase tracking-widest mb-1 flex items-center gap-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5" /> PILOT DISTRICT FOCUS
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Tirupur Municipal Corporation</h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
              Monitoring ₹115.37 Cr Central Bus Stand redevelopment + ₹100 Cr Urban Road paving
              under GO Ms No.173.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex justify-between items-center text-xs font-mono">
            <span className="text-[var(--text-primary)] font-medium">Zone: West TN</span>
            <span className="text-[var(--accent-mint)] font-semibold">11.1085° N, 77.3411° E</span>
          </div>
        </div>

        <div className="bottom-card opacity-0 stitch-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-[var(--accent-mint)] uppercase tracking-widest mb-1 flex items-center gap-1.5 font-bold">
              <FileCheck2 className="w-3.5 h-3.5" /> REAL-TIME POLICY VERDICT RULES
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Automated Sanction Guardrails</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="bg-[var(--bg-subtle)] p-3 border border-[var(--border-subtle)] rounded">
                <span className="text-[var(--accent-mint)] font-mono font-bold block mb-1">Pass Rule:</span>
                <span className="text-[var(--text-muted)]">Authenticity ≥ 80% + Valid Stage + Unflagged GST invoice.</span>
              </div>
              <div className="bg-[var(--bg-subtle)] p-3 border border-[var(--border-subtle)] rounded">
                <span className="text-[var(--accent-ice)] font-mono font-bold block mb-1">Escalate Rule:</span>
                <span className="text-[var(--text-muted)]">SLA timeout exceeded or stage dispute bumps case level automatically.</span>
              </div>
              <div className="bg-[var(--bg-subtle)] p-3 border border-[var(--border-subtle)] rounded">
                <span className="text-[#f87171] font-mono font-bold block mb-1">Lockout Rule:</span>
                <span className="text-[var(--text-muted)]">Invoice flagged 'FAKE' triggers immediate disbursement lock.</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <img src="/lady-justice-avatar.jpg" alt="" className="w-5 h-5 rounded-full object-cover border border-[#8BF497]/50" />
              <span className="text-[var(--text-primary)] font-medium">Nidhi Kaan Evidence Engine Active</span>
            </span>
            <span className="text-[var(--accent-mint)] font-semibold">Section 65B Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
