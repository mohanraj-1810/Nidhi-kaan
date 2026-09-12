import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import {
  ShieldAlert,
  FastForward,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Clock,
  Send,
  Building,
  User,
} from 'lucide-react';
import { CaseItem } from '../types';

interface CaseInspectorViewProps {
  cases: CaseItem[];
  selectedCase: CaseItem | null;
  onSelectCase: (c: CaseItem) => void;
  onVerifyGST: (id: string) => Promise<void>;
  onFastForward: (id: string, reason?: string) => Promise<void>;
  loading: boolean;
  actionLoading: boolean;
}

export const CaseInspectorView: React.FC<CaseInspectorViewProps> = ({
  cases,
  selectedCase,
  onSelectCase,
  onVerifyGST,
  onFastForward,
  loading,
  actionLoading,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Stagger animate case cards when cases list loads or changes
  useEffect(() => {
    if (listRef.current) {
      const cards = listRef.current.querySelectorAll('.case-card-item');
      if (cards.length > 0) {
        anime({
          targets: cards,
          opacity: [0, 1],
          translateX: [-20, 0],
          delay: anime.stagger(50, { start: 100 }),
          duration: 450,
          easing: 'easeOutQuad',
        });
      }
    }
  }, [cases.length]);

  // Animate detail pane when selected case changes
  useEffect(() => {
    if (detailRef.current && selectedCase) {
      anime({
        targets: detailRef.current,
        opacity: [0.3, 1],
        translateY: [12, 0],
        duration: 350,
        easing: 'easeOutQuad',
      });
    }
  }, [selectedCase?.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-5 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-[var(--accent-mint)] uppercase tracking-widest mb-1 flex items-center gap-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BF497] animate-ping" />
            CASE FORENSIC WORKSPACE
          </div>
          <h1 className="text-3xl font-editorial font-light text-[var(--text-primary)]">
            Two-Panel Case &amp; Evidence Inspector
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Review evidence fusion scores, trigger real-time GST verification against the backend, or fast-forward the escalation hierarchy.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded border border-[#8BF497]/35 bg-[var(--bg-card)] shadow-sm">
          <img
            src="/lady-justice-avatar.jpg"
            alt="Lady Justice Seal"
            className="w-8 h-8 rounded-full object-cover border border-[#8BF497]/60"
          />
          <div className="text-[10px] font-mono text-[var(--accent-mint)] leading-tight">
            <div className="font-bold tracking-wider">JUSTICE SEAL</div>
            <div className="text-[var(--text-muted)] text-[9px]">EVIDENCE VERIFIED</div>
          </div>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Index): 4 cols */}
        <div className="lg:col-span-4 stitch-card p-5 max-h-[720px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold">
              Logged Cases ({cases.length})
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Select to inspect</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-[var(--text-muted)]">
              Loading active dossiers...
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12 text-xs text-[var(--text-muted)]">
              No cases recorded yet. Submit a new case to start verification.
            </div>
          ) : (
            <div ref={listRef} className="space-y-3">
              {cases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                const isFraud = c.gst_status === 'FRAUD_FLAGGED';

                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCase(c)}
                    className={`case-card-item p-4 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#8BF497] bg-[#8BF497]/15 shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-[#8BF497]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[var(--accent-mint)] uppercase font-bold">
                        {c.project_type}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isFraud
                            ? 'stitch-badge-red'
                            : c.authenticity_status === 'PASSED'
                            ? 'stitch-badge-green'
                            : 'stitch-badge-ice'
                        }`}
                      >
                        {isFraud ? 'FRAUD' : c.authenticity_status}
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-[var(--text-primary)] truncate">
                      {c.beneficiary_contractor_id}
                    </div>

                    <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center justify-between font-mono">
                      <span>Stage: {c.claimed_stage}</span>
                      <span className="text-[var(--accent-mint)] font-medium">{c.escalation_level}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (Deep-Dive Workspace): 8 cols */}
        <div className="lg:col-span-8">
          {selectedCase ? (
            <div ref={detailRef} className="space-y-6">
              {/* Top Determination Card */}
              <div
                className={`stitch-card p-6 border ${
                  selectedCase.gst_status === 'FRAUD_FLAGGED'
                    ? 'border-[#f87171] bg-[#f87171]/10'
                    : selectedCase.authenticity_status === 'PASSED'
                    ? 'border-[#8BF497]/40 bg-[var(--bg-subtle)]'
                    : 'border-yellow-500/40 bg-yellow-500/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 mb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[var(--accent-mint)] tracking-widest font-bold">
                      CASE VERDICT &amp; DETERMINATION
                    </span>
                    <h2 className="text-2xl font-editorial font-bold text-[var(--text-primary)] mt-0.5">
                      {selectedCase.gst_status === 'FRAUD_FLAGGED'
                        ? 'HIGH RISK — FRAUD SUSPECTED'
                        : selectedCase.authenticity_status === 'PASSED' &&
                          selectedCase.progress_status === 'APPROVED'
                        ? 'VERIFIED & COMPLIANT'
                        : 'FLAGGED FOR INVESTIGATION'}
                    </h2>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      Dossier ID: {selectedCase.id}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                        selectedCase.gst_status === 'FRAUD_FLAGGED'
                          ? 'bg-[#f87171] text-white'
                          : 'bg-[#8BF497] text-[#000000]'
                      }`}
                    >
                      {selectedCase.gst_status === 'FRAUD_FLAGGED'
                        ? 'PAYMENT FROZEN'
                        : 'CLEARED FOR TRANCHE'}
                    </span>
                  </div>
                </div>

                {/* Subsystem Scoreboard */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  {/* Sys 1 */}
                  <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded shadow-sm">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase mb-1">
                      System 1 • Authenticity
                    </div>
                    <div
                      className={`font-bold flex items-center gap-1.5 ${
                        selectedCase.authenticity_status === 'PASSED'
                          ? 'text-[var(--accent-mint)]'
                          : 'text-[#f87171]'
                      }`}
                    >
                      {selectedCase.authenticity_status === 'PASSED' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span>{selectedCase.authenticity_status}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                      Coords: {selectedCase.latitude?.toFixed(4) ?? '0'},{' '}
                      {selectedCase.longitude?.toFixed(4) ?? '0'}
                    </span>
                  </div>

                  {/* Sys 2 */}
                  <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded shadow-sm">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase mb-1">
                      System 2 • Progress CV
                    </div>
                    <div
                      className={`font-bold flex items-center gap-1.5 ${
                        selectedCase.progress_status === 'APPROVED'
                          ? 'text-[var(--accent-mint)]'
                          : 'text-[#f87171]'
                      }`}
                    >
                      {selectedCase.progress_status === 'APPROVED' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span>{selectedCase.progress_status}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                      Claim: {selectedCase.claimed_stage}
                    </span>
                  </div>

                  {/* Sys 3 */}
                  <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded shadow-sm">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase mb-1">
                      System 3 • GST Cross-Check
                    </div>
                    <div
                      className={`font-bold flex items-center gap-1.5 ${
                        selectedCase.gst_status === 'VALID'
                          ? 'text-[var(--accent-mint)]'
                          : selectedCase.gst_status === 'FRAUD_FLAGGED'
                          ? 'text-[#f87171]'
                          : 'text-yellow-500'
                      }`}
                    >
                      {selectedCase.gst_status === 'VALID' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <ShieldAlert className="w-4 h-4" />
                      )}
                      <span>{selectedCase.gst_status}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] mt-1 block truncate">
                      Inv: {selectedCase.invoice_number || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Case Metadata Breakdown */}
              <div className="stitch-card p-6">
                <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4 border-b border-[var(--border-subtle)] pb-2">
                  Dossier Intelligence
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[var(--text-muted)] block mb-0.5">Beneficiary / Contractor ID:</span>
                    <span className="font-mono text-[var(--text-primary)] font-semibold text-sm">
                      {selectedCase.beneficiary_contractor_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block mb-0.5">Project Scheme:</span>
                    <span className="font-mono text-[var(--text-primary)] font-semibold text-sm">
                      {selectedCase.project_type}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block mb-0.5">Current Escalation Desk:</span>
                    <span className="font-mono text-[var(--accent-mint)] font-semibold text-sm">
                      {selectedCase.escalation_level}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block mb-0.5">SLA Countdown:</span>
                    <span className="font-mono text-[var(--text-primary)] font-semibold text-sm">
                      {selectedCase.sla_timer_hours} Hours Remaining
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block mb-0.5">Submitted Timestamp:</span>
                    <span className="font-mono text-[var(--text-muted)]">
                      {new Date(selectedCase.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block mb-0.5">Auto-Escalated Status:</span>
                    <span className="font-mono text-[var(--text-primary)]">
                      {selectedCase.is_escalated ? 'YES (Auto-Bumped)' : 'NO (Normal Window)'}
                    </span>
                  </div>
                </div>

                {selectedCase.rejection_reason && (
                  <div className="mt-4 p-3 bg-[#f87171]/10 border border-[#f87171]/35 rounded text-xs">
                    <span className="text-[#f87171] font-bold block mb-1">
                      Recorded Rejection Reason:
                    </span>
                    <span className="text-[var(--text-primary)]">{selectedCase.rejection_reason}</span>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="stitch-card p-6">
                <div className="text-xs font-mono uppercase text-[var(--accent-mint)] mb-3 font-bold">
                  DIRECT BACKEND ACTIONS
                </div>

                <div className="flex flex-wrap gap-4">
                  {/* Action 1: Verify GST */}
                  <button
                    onClick={() => onVerifyGST(selectedCase.id)}
                    disabled={actionLoading}
                    className="px-5 py-2.5 border border-[#8BF497] bg-[var(--bg-card)] text-[var(--accent-mint)] text-xs font-mono font-semibold rounded hover:bg-[#8BF497]/15 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Run GST Portal Verification</span>
                  </button>

                  {/* Action 2: Fast-Forward */}
                  <button
                    onClick={() => {
                      if (showRejectInput) {
                        onFastForward(selectedCase.id, rejectReason || undefined);
                        setShowRejectInput(false);
                        setRejectReason('');
                      } else {
                        onFastForward(selectedCase.id);
                      }
                    }}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-[#8BF497] text-[#000000] text-xs font-mono font-bold rounded hover:bg-[#78e385] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <FastForward className="w-4 h-4" />
                    <span>Fast-Forward Escalation</span>
                  </button>

                  <button
                    onClick={() => setShowRejectInput(!showRejectInput)}
                    className="px-4 py-2 border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] rounded hover:text-[var(--text-primary)] hover:border-[#8BF497] transition-colors cursor-pointer"
                  >
                    {showRejectInput ? 'Cancel Reject Reason' : 'Add Reject Note'}
                  </button>
                </div>

                {showRejectInput && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-2">
                    <label className="block text-xs text-[var(--text-muted)]">
                      Attach Rejection Reason for Next Escalation Level:
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g., Concrete slab thickness does not meet tender specification"
                      className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[#8BF497] outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="stitch-card p-16 text-center text-[var(--text-muted)]">
              <FileText className="w-12 h-12 mx-auto text-[var(--accent-mint)] mb-3 opacity-60" />
              <div className="text-base font-semibold text-[var(--text-primary)]">No Dossier Selected</div>
              <p className="text-xs mt-1">
                Choose a case from the list on the left to inspect multi-model evidence details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
