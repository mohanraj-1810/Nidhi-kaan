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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-[rgba(237,227,208,0.1)] pb-5 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9a15c] animate-ping" />
            CASE FORENSIC WORKSPACE
          </div>
          <h1 className="text-3xl font-editorial font-light text-[#ede3d0]">
            Two-Panel Case &amp; Evidence Inspector
          </h1>
          <p className="text-xs text-[#a8a29b] mt-1">
            Review evidence fusion scores, trigger real-time GST verification against the backend, or fast-forward the escalation hierarchy.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded border border-[#d9a15c]/25 bg-[#171512]">
          <img
            src="/lady-justice-avatar.jpg"
            alt="Lady Justice Seal"
            className="w-8 h-8 rounded-full object-cover border border-[#d9a15c]/50"
          />
          <div className="text-[10px] font-mono text-[#d9a15c] leading-tight">
            <div className="font-semibold tracking-wider">JUSTICE SEAL</div>
            <div className="text-[#a8a29b] text-[9px]">EVIDENCE VERIFIED</div>
          </div>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Index): 4 cols */}
        <div className="lg:col-span-4 stitch-card p-5 max-h-[720px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between border-b border-[rgba(237,227,208,0.1)] pb-3 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#ede3d0]">
              Logged Cases ({cases.length})
            </span>
            <span className="text-[10px] text-[#a8a29b] font-mono">Select to inspect</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-[#a8a29b]">
              Loading active dossiers...
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#a8a29b]">
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
                        ? 'border-[#d9a15c] bg-[#1c1a17]'
                        : 'border-[rgba(237,227,208,0.1)] bg-[#141312] hover:border-[rgba(217,161,92,0.3)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[#d9a15c] uppercase">
                        {c.project_type}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isFraud
                            ? 'stitch-badge-red'
                            : c.authenticity_status === 'PASSED'
                            ? 'stitch-badge-green'
                            : 'stitch-badge-gold'
                        }`}
                      >
                        {isFraud ? 'FRAUD' : c.authenticity_status}
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-[#ede3d0] truncate">
                      {c.beneficiary_contractor_id}
                    </div>

                    <div className="text-[11px] text-[#a8a29b] mt-1 flex items-center justify-between font-mono">
                      <span>Stage: {c.claimed_stage}</span>
                      <span className="text-[#d9a15c]">{c.escalation_level}</span>
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
                    ? 'border-[#c84b31]/60 bg-[#c84b31]/10'
                    : selectedCase.authenticity_status === 'PASSED'
                    ? 'border-[rgba(237,227,208,0.15)] bg-[#171512]'
                    : 'border-yellow-700/40 bg-yellow-950/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(237,227,208,0.1)] pb-4 mb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#d9a15c] tracking-widest">
                      CASE VERDICT &amp; DETERMINATION
                    </span>
                    <h2 className="text-2xl font-editorial font-bold text-[#ede3d0] mt-0.5">
                      {selectedCase.gst_status === 'FRAUD_FLAGGED'
                        ? 'HIGH RISK — FRAUD SUSPECTED'
                        : selectedCase.authenticity_status === 'PASSED' &&
                          selectedCase.progress_status === 'APPROVED'
                        ? 'VERIFIED & COMPLIANT'
                        : 'FLAGGED FOR INVESTIGATION'}
                    </h2>
                    <span className="text-xs text-[#a8a29b] font-mono">
                      Dossier ID: {selectedCase.id}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                        selectedCase.gst_status === 'FRAUD_FLAGGED'
                          ? 'bg-[#c84b31] text-white'
                          : 'bg-[#5c8a5c] text-white'
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
                  <div className="p-3 bg-[#0f0e0d] border border-[rgba(237,227,208,0.08)] rounded">
                    <div className="text-[10px] text-[#a8a29b] uppercase mb-1">
                      System 1 • Authenticity
                    </div>
                    <div
                      className={`font-bold flex items-center gap-1.5 ${
                        selectedCase.authenticity_status === 'PASSED'
                          ? 'text-[#78be78]'
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
                    <span className="text-[10px] text-[#a8a29b] mt-1 block">
                      Coords: {selectedCase.latitude?.toFixed(4) ?? '0'},{' '}
                      {selectedCase.longitude?.toFixed(4) ?? '0'}
                    </span>
                  </div>

                  {/* Sys 2 */}
                  <div className="p-3 bg-[#0f0e0d] border border-[rgba(237,227,208,0.08)] rounded">
                    <div className="text-[10px] text-[#a8a29b] uppercase mb-1">
                      System 2 • Progress CV
                    </div>
                    <div
                      className={`font-bold flex items-center gap-1.5 ${
                        selectedCase.progress_status === 'APPROVED'
                          ? 'text-[#78be78]'
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
                    <span className="text-[10px] text-[#a8a29b] mt-1 block">
                      Claim: {selectedCase.claimed_stage}
                    </span>
                  </div>

                  {/* Sys 3 */}
                  <div className="p-3 bg-[#0f0e0d] border border-[rgba(237,227,208,0.08)] rounded">
                    <div className="text-[10px] text-[#a8a29b] uppercase mb-1">
                      System 3 • GST Cross-Check
                    </div>
                    <div
                      className={`font-bold flex items-center gap-1.5 ${
                        selectedCase.gst_status === 'VALID'
                          ? 'text-[#78be78]'
                          : selectedCase.gst_status === 'FRAUD_FLAGGED'
                          ? 'text-[#f87171]'
                          : 'text-yellow-400'
                      }`}
                    >
                      {selectedCase.gst_status === 'VALID' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <ShieldAlert className="w-4 h-4" />
                      )}
                      <span>{selectedCase.gst_status}</span>
                    </div>
                    <span className="text-[10px] text-[#a8a29b] mt-1 block truncate">
                      Inv: {selectedCase.invoice_number || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Case Metadata Breakdown */}
              <div className="stitch-card p-6">
                <h3 className="text-sm font-bold text-[#ede3d0] uppercase tracking-wider mb-4 border-b border-[rgba(237,227,208,0.1)] pb-2">
                  Dossier Intelligence
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#a8a29b] block mb-0.5">Beneficiary / Contractor ID:</span>
                    <span className="font-mono text-[#ede3d0] font-semibold text-sm">
                      {selectedCase.beneficiary_contractor_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#a8a29b] block mb-0.5">Project Scheme:</span>
                    <span className="font-mono text-[#ede3d0] font-semibold text-sm">
                      {selectedCase.project_type}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#a8a29b] block mb-0.5">Current Escalation Desk:</span>
                    <span className="font-mono text-[#d9a15c] font-semibold text-sm">
                      {selectedCase.escalation_level}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#a8a29b] block mb-0.5">SLA Countdown:</span>
                    <span className="font-mono text-[#ede3d0] font-semibold text-sm">
                      {selectedCase.sla_timer_hours} Hours Remaining
                    </span>
                  </div>
                  <div>
                    <span className="text-[#a8a29b] block mb-0.5">Submitted Timestamp:</span>
                    <span className="font-mono text-[#a8a29b]">
                      {new Date(selectedCase.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#a8a29b] block mb-0.5">Auto-Escalated Status:</span>
                    <span className="font-mono text-[#ede3d0]">
                      {selectedCase.is_escalated ? 'YES (Auto-Bumped)' : 'NO (Normal Window)'}
                    </span>
                  </div>
                </div>

                {selectedCase.rejection_reason && (
                  <div className="mt-4 p-3 bg-[#c84b31]/10 border border-[#c84b31]/30 rounded text-xs">
                    <span className="text-[#f87171] font-bold block mb-1">
                      Recorded Rejection Reason:
                    </span>
                    <span className="text-[#ede3d0]">{selectedCase.rejection_reason}</span>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="stitch-card p-6">
                <div className="text-xs font-mono uppercase text-[#d9a15c] mb-3">
                  DIRECT BACKEND ACTIONS
                </div>

                <div className="flex flex-wrap gap-4">
                  {/* Action 1: Verify GST */}
                  <button
                    onClick={() => onVerifyGST(selectedCase.id)}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-[#141312] border border-[#d9a15c] text-[#d9a15c] text-xs font-mono font-semibold rounded hover:bg-[#d9a15c] hover:text-[#0f0e0d] transition-all disabled:opacity-50 flex items-center gap-2"
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
                    className="px-5 py-2.5 bg-[#d9a15c] text-[#0f0e0d] text-xs font-mono font-bold rounded hover:bg-[#c48e4b] transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <FastForward className="w-4 h-4" />
                    <span>Fast-Forward Escalation</span>
                  </button>

                  <button
                    onClick={() => setShowRejectInput(!showRejectInput)}
                    className="px-4 py-2 border border-[rgba(237,227,208,0.2)] text-xs text-[#a8a29b] rounded hover:text-[#ede3d0] transition-colors"
                  >
                    {showRejectInput ? 'Cancel Reject Reason' : 'Add Reject Note'}
                  </button>
                </div>

                {showRejectInput && (
                  <div className="mt-4 pt-4 border-t border-[rgba(237,227,208,0.1)] space-y-2">
                    <label className="block text-xs text-[#a8a29b]">
                      Attach Rejection Reason for Next Escalation Level:
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g., Concrete slab thickness does not meet tender specification"
                      className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2 text-xs text-[#ede3d0] focus:border-[#d9a15c] outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="stitch-card p-16 text-center text-[#a8a29b]">
              <FileText className="w-12 h-12 mx-auto text-[#d9a15c] mb-3 opacity-60" />
              <div className="text-base font-semibold text-[#ede3d0]">No Dossier Selected</div>
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
