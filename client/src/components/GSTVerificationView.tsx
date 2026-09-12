import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import {
  FileSearch,
  CheckCircle,
  XCircle,
  AlertOctagon,
  RefreshCw,
  Database,
  Building,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { VerifyGSTResponse } from '../types';

export const GSTVerificationView: React.FC = () => {
  const [caseId, setCaseId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyGSTResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      anime({
        targets: formRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      anime({
        targets: resultRef.current,
        opacity: [0, 1],
        scale: [0.88, 1],
        duration: 700,
        easing: 'easeOutElastic(1, .6)',
      });
    }
  }, [result]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) {
      setError('Please provide or select a valid Case UUID from your dossier list.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.verifyGST(caseId);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'GST verification request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-5 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-[var(--accent-mint)] uppercase tracking-widest mb-1 flex items-center gap-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BF497] animate-ping" />
            FINANCIAL FRAUD GATEWAY • SYSTEM 3
          </div>
          <h1 className="text-3xl font-editorial font-light text-[var(--text-primary)]">
            GSTN Cross-Reconciliation Portal
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl">
            Simulates instant IRIS/NIC GSTR-2B invoice clearance. Detects shell company invoice churn, fake ITC claims, and mismatches between physical milestone completion and declared GST filings.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded border border-[#8BF497]/35 bg-[var(--bg-card)] shadow-sm">
          <img
            src="/lady-justice-avatar.jpg"
            alt="Lady Justice Seal"
            className="w-8 h-8 rounded-full object-cover border border-[#8BF497]/60"
          />
          <div className="text-[10px] font-mono text-[var(--accent-mint)] leading-tight">
            <div className="font-bold tracking-wider">TAX RECON</div>
            <div className="text-[var(--text-muted)] text-[9px]">GSTR-2B AUDIT</div>
          </div>
        </div>
      </div>

      {/* Lookup Form */}
      <form ref={formRef} onSubmit={handleVerify} className="stitch-card p-7 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-2">
              Target Case UUID (from database)
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value.trim())}
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded px-3 py-2.5 text-xs text-[var(--text-primary)] font-mono focus:border-[#8BF497] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-2">
              Claimed Procurement Invoice #
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="e.g., INV-2026-TN-08842"
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded px-3 py-2.5 text-xs text-[var(--text-primary)] font-mono focus:border-[#8BF497] outline-none transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-[#f87171]/15 border border-[#f87171]/40 text-[#f87171] text-xs font-mono rounded flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 flex-wrap gap-3">
          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            Tip: You can also click "Run GST Verification" inside the Case Inspector for any dossier.
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#8BF497] text-[#000000] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#78e385] transition-all disabled:opacity-50 flex items-center gap-2 shadow-md cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Reconciling GSTN...' : 'Reconcile Invoice'}</span>
          </button>
        </div>
      </form>

      {/* Verification Result Card */}
      {result && (
        <div
          ref={resultRef}
          className={`stitch-card p-8 border ${
            result.gst_status === 'FRAUD_FLAGGED'
              ? 'border-[#f87171] bg-[#f87171]/10'
              : 'border-[#8BF497] bg-[#8BF497]/15'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
            <div className="flex items-center gap-3">
              {result.gst_status === 'FRAUD_FLAGGED' ? (
                <XCircle className="w-8 h-8 text-[#f87171]" />
              ) : (
                <CheckCircle className="w-8 h-8 text-[#8BF497]" />
              )}
              <div>
                <h3 className="text-xl font-editorial font-bold text-[var(--text-primary)]">
                  {result.message}
                </h3>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Dossier Ref: {result.id}
                </span>
              </div>
            </div>

            <span
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                result.gst_status === 'FRAUD_FLAGGED'
                  ? 'bg-[#f87171] text-white'
                  : 'bg-[#8BF497] text-[#000000]'
              }`}
            >
              {result.gst_status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded shadow-sm">
              <span className="text-[var(--text-muted)] block mb-1">Invoice Number:</span>
              <span className="text-[var(--text-primary)] font-bold">{result.invoice_number || 'None'}</span>
            </div>
            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded shadow-sm">
              <span className="text-[var(--text-muted)] block mb-1">Disbursement Action:</span>
              <span
                className={
                  result.gst_status === 'FRAUD_FLAGGED' ? 'text-[#f87171] font-bold' : 'text-[var(--accent-mint)] font-bold'
                }
              >
                {result.gst_status === 'FRAUD_FLAGGED' ? 'FROZEN & REFERRED' : 'APPROVED'}
              </span>
            </div>
            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded shadow-sm">
              <span className="text-[var(--text-muted)] block mb-1">Audit Signature:</span>
              <span className="text-[var(--accent-mint)] font-bold">SHA-256 SEALED</span>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Explanatory Blueprint */}
      <div className="stitch-card p-6">
        <h3 className="text-xs font-mono text-[var(--accent-mint)] uppercase tracking-widest mb-3 font-bold">
          4-Point Fraud Elimination Protocol
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--text-muted)]">
          <div className="border border-[var(--border-subtle)] p-3 rounded bg-[var(--bg-subtle)]">
            <span className="text-[var(--text-primary)] font-bold block mb-1">1. GSTR-2B Matching</span>
            Ensures contractor isn't claiming input tax on non-existent supplier invoices.
          </div>
          <div className="border border-[var(--border-subtle)] p-3 rounded bg-[var(--bg-subtle)]">
            <span className="text-[var(--text-primary)] font-bold block mb-1">2. Circular Billing Detection</span>
            Analyzes shell entity clusters trading identical cement/steel volumes without transit.
          </div>
          <div className="border border-[var(--border-subtle)] p-3 rounded bg-[var(--bg-subtle)]">
            <span className="text-[var(--text-primary)] font-bold block mb-1">3. E-Way Bill Cross-Lock</span>
            GPS RFID toll plaza scan data matched against claimed delivery truck numbers.
          </div>
          <div className="border border-[var(--border-subtle)] p-3 rounded bg-[var(--bg-subtle)]">
            <span className="text-[var(--text-primary)] font-bold block mb-1">4. Zero Delay Freeze</span>
            Auto-suspends treasury payment voucher generation upon System 3 fraud verdict.
          </div>
        </div>
      </div>
    </div>
  );
};
