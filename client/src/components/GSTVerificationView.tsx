import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle,
  XCircle,
  AlertOctagon,
  RefreshCw,
  Database,
  Building,
} from 'lucide-react';
import { api } from '../services/api';
import { VerifyGSTResponse } from '../types';

export const GSTVerificationView: React.FC = () => {
  const [caseId, setCaseId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-TN-TP-08842');
  const [result, setResult] = useState<VerifyGSTResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="border-b border-[rgba(237,227,208,0.1)] pb-5">
        <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest mb-1">
          FINANCIAL FRAUD GATEWAY • SYSTEM 3
        </div>
        <h1 className="text-3xl font-editorial font-light text-[#ede3d0]">
          GSTN Cross-Reconciliation Portal
        </h1>
        <p className="text-xs text-[#a8a29b] mt-1">
          Cross-checks supplier GSTR-1 declarations against contractor GSTR-2B filing records. Invoices containing 'FAKE' trigger immediate freeze alerts.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleVerify} className="stitch-card p-7 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a29b] mb-2">
              Target Case UUID (from database)
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value.trim())}
              className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2.5 text-xs text-[#ede3d0] font-mono focus:border-[#d9a15c] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a29b] mb-2">
              Claimed Procurement Invoice #
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2.5 text-xs text-[#ede3d0] font-mono focus:border-[#d9a15c] outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-[#c84b31]/20 border border-[#c84b31]/40 text-[#f87171] text-xs font-mono rounded flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] text-[#a8a29b] font-mono">
            Tip: You can also click "Run GST Verification" inside the Case Inspector for any dossier.
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#d9a15c] text-[#0f0e0d] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#c48e4b] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Reconciling GSTN...' : 'Reconcile Invoice'}</span>
          </button>
        </div>
      </form>

      {/* Verification Result Card */}
      {result && (
        <div
          className={`stitch-card p-8 border ${
            result.gst_status === 'FRAUD_FLAGGED'
              ? 'border-[#c84b31] bg-[#c84b31]/10'
              : 'border-[#5c8a5c] bg-[#5c8a5c]/10'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[rgba(237,227,208,0.1)] pb-4 mb-6">
            <div className="flex items-center gap-3">
              {result.gst_status === 'FRAUD_FLAGGED' ? (
                <XCircle className="w-8 h-8 text-[#c84b31]" />
              ) : (
                <CheckCircle className="w-8 h-8 text-[#5c8a5c]" />
              )}
              <div>
                <h3 className="text-xl font-editorial font-bold text-[#ede3d0]">
                  {result.message}
                </h3>
                <span className="text-xs font-mono text-[#a8a29b]">
                  Dossier Ref: {result.id}
                </span>
              </div>
            </div>

            <span
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                result.gst_status === 'FRAUD_FLAGGED'
                  ? 'bg-[#c84b31] text-white'
                  : 'bg-[#5c8a5c] text-white'
              }`}
            >
              {result.gst_status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#0f0e0d] border border-[rgba(237,227,208,0.1)] rounded">
              <span className="text-[#a8a29b] block mb-1">Invoice Number:</span>
              <span className="text-[#ede3d0] font-bold">{result.invoice_number || 'None'}</span>
            </div>
            <div className="p-3 bg-[#0f0e0d] border border-[rgba(237,227,208,0.1)] rounded">
              <span className="text-[#a8a29b] block mb-1">Disbursement Action:</span>
              <span
                className={
                  result.gst_status === 'FRAUD_FLAGGED' ? 'text-[#f87171] font-bold' : 'text-[#78be78] font-bold'
                }
              >
                {result.gst_status === 'FRAUD_FLAGGED' ? 'FROZEN & REFERRED' : 'APPROVED'}
              </span>
            </div>
            <div className="p-3 bg-[#0f0e0d] border border-[rgba(237,227,208,0.1)] rounded">
              <span className="text-[#a8a29b] block mb-1">Audit Signature:</span>
              <span className="text-[#d9a15c] font-bold">SHA-256 SEALED</span>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Explanatory Blueprint */}
      <div className="stitch-card p-6">
        <h3 className="text-xs font-mono text-[#d9a15c] uppercase tracking-widest mb-3">
          4-Point Fraud Elimination Protocol
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#a8a29b]">
          <div className="border border-[rgba(237,227,208,0.08)] p-3 rounded bg-[#141312]">
            <span className="text-[#ede3d0] font-bold block mb-1">1. GSTR-2B Matching</span>
            Verifies that the seller officially declared this invoice in their sales return (GSTR-1).
          </div>
          <div className="border border-[rgba(237,227,208,0.08)] p-3 rounded bg-[#141312]">
            <span className="text-[#ede3d0] font-bold block mb-1">2. Quantity vs. Site Demand</span>
            Cross-checks billed cement/steel metrics against System 2's computer-vision volume calculation.
          </div>
          <div className="border border-[rgba(237,227,208,0.08)] p-3 rounded bg-[#141312]">
            <span className="text-[#ede3d0] font-bold block mb-1">3. Duplicate Hash Registry</span>
            Ensures identical invoices cannot be reused or submitted across separate taluk projects.
          </div>
          <div className="border border-[rgba(237,227,208,0.08)] p-3 rounded bg-[#141312]">
            <span className="text-[#ede3d0] font-bold block mb-1">4. Shell Vendor Detection</span>
            Flags supplier GSTINs exhibiting anomalous transaction velocity across multiple contractors.
          </div>
        </div>
      </div>
    </div>
  );
};
