import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { Send, MapPin, Building, ShieldCheck, AlertCircle } from 'lucide-react';
import { CaseCreatePayload, ProjectType } from '../types';

interface NewCaseModalProps {
  onSubmit: (payload: CaseCreatePayload) => Promise<void>;
  loading: boolean;
  onSuccessNavigate: () => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  onSubmit,
  loading,
  onSuccessNavigate,
}) => {
  const [projectType, setProjectType] = useState<ProjectType>('Bus Stand');
  const [contractorId, setContractorId] = useState('TN-TPR-BUS-2026-081');
  const [stage, setStage] = useState('Roof');
  const [latitude, setLatitude] = useState(11.1085);
  const [longitude, setLongitude] = useState(77.3411);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-TN-TP-08842');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current.children,
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(80),
        duration: 550,
        easing: 'easeOutQuad',
      });
    }
  }, []);

  useEffect(() => {
    if (statusRef.current && statusMsg) {
      anime({
        targets: statusRef.current,
        scale: [0.92, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutElastic(1, .6)',
      });
    }
  }, [statusMsg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      await onSubmit({
        project_type: projectType,
        beneficiary_contractor_id: contractorId,
        claimed_stage: stage,
        latitude: Number(latitude),
        longitude: Number(longitude),
        invoice_number: invoiceNumber || undefined,
      });
      setStatusMsg('Case registered and verified through AI Pipeline!');
      setTimeout(() => {
        onSuccessNavigate();
      }, 1000);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message || 'Failed to submit'}`);
    }
  };

  const presetTirupurBusStand = () => {
    setProjectType('Bus Stand');
    setContractorId('TN-TPR-BUS-2026-081');
    setStage('Roof');
    setLatitude(11.1085);
    setLongitude(77.3411);
    setInvoiceNumber('INV-2026-TN-TP-08842');
  };

  const presetFraudSim = () => {
    setProjectType('Road');
    setContractorId('TN-CON-ROAD-409');
    setStage('Finishing');
    setLatitude(11.102);
    setLongitude(77.345);
    setInvoiceNumber('INV-FAKE-9921');
  };

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[rgba(237,227,208,0.1)] pb-5 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9a15c] animate-ping" />
            CASE INTAKE &amp; AI VERIFICATION
          </div>
          <h1 className="text-3xl font-editorial font-light text-[#ede3d0]">
            Register Milestone Submission
          </h1>
          <p className="text-xs text-[#a8a29b] mt-1">
            Submits field evidence to the backend API (`/api/v1/cases/submit`). Runs System 1 (Geo), System 2 (Stage), and System 3 (GST) synchronously.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded border border-[#d9a15c]/25 bg-[#171512]">
          <img
            src="/lady-justice-avatar.jpg"
            alt="Lady Justice Seal"
            className="w-8 h-8 rounded-full object-cover border border-[#d9a15c]/50"
          />
          <div className="text-[10px] font-mono text-[#d9a15c] leading-tight">
            <div className="font-semibold tracking-wider">LEGAL PORTAL</div>
            <div className="text-[#a8a29b] text-[9px]">JUSTICE ACCORD</div>
          </div>
        </div>
      </div>

      {/* Preset Quick-Buttons */}
      <div className="stitch-card p-4 flex items-center justify-between gap-4">
        <span className="text-xs font-mono text-[#a8a29b] uppercase">Quick Test Scenarios:</span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={presetTirupurBusStand}
            className="px-3 py-1.5 rounded border border-[#d9a15c]/40 text-[#d9a15c] text-xs font-mono hover:bg-[#d9a15c]/10"
          >
            Tirupur Bus Stand (Valid)
          </button>
          <button
            type="button"
            onClick={presetFraudSim}
            className="px-3 py-1.5 rounded border border-[#c84b31]/40 text-[#f87171] text-xs font-mono hover:bg-[#c84b31]/10"
          >
            GST Fraud Trigger (INV-FAKE)
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="stitch-card p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Project Type */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a29b] mb-2">
              Scheme Category
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
              className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2.5 text-xs text-[#ede3d0] focus:border-[#d9a15c] outline-none"
            >
              <option value="Bus Stand">Bus Stand / Infrastructure (MAWS)</option>
              <option value="Road">Road Maintenance &amp; Repair</option>
              <option value="Housing">Housing (Kalaignarin Kanavu Illam)</option>
            </select>
          </div>

          {/* Contractor ID */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a29b] mb-2">
              Beneficiary / Contractor ID
            </label>
            <input
              type="text"
              required
              value={contractorId}
              onChange={(e) => setContractorId(e.target.value)}
              className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2.5 text-xs text-[#ede3d0] font-mono focus:border-[#d9a15c] outline-none"
            />
          </div>

          {/* Claimed Stage */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a29b] mb-2">
              Claimed Structural Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2.5 text-xs text-[#ede3d0] focus:border-[#d9a15c] outline-none"
            >
              <option value="Foundation">Foundation (Stage 1)</option>
              <option value="Plinth">Plinth / Walls (Stage 2)</option>
              <option value="Roof">Roof / Slab (Stage 3)</option>
              <option value="Finishing">Finishing / Electrical (Stage 4)</option>
              <option value="Complete">Complete (Final)</option>
              <option value="Invalid_Stage">Invalid_Stage (Will fail System 2)</option>
            </select>
          </div>

          {/* Invoice Number */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a29b] mb-2">
              Procurement GST Invoice #
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="e.g., INV-2026-TN-08842 (use 'FAKE' for fraud)"
              className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2.5 text-xs text-[#ede3d0] font-mono focus:border-[#d9a15c] outline-none"
            />
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a29b] mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#d9a15c]" />
              Latitude (0,0 fails System 1)
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))}
              className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2.5 text-xs text-[#ede3d0] font-mono focus:border-[#d9a15c] outline-none"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a29b] mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#d9a15c]" />
              Longitude
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))}
              className="w-full bg-[#0f0e0d] border border-[rgba(237,227,208,0.2)] rounded px-3 py-2.5 text-xs text-[#ede3d0] font-mono focus:border-[#d9a15c] outline-none"
            />
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`p-3 rounded text-xs font-mono ${
              statusMsg.includes('Error')
                ? 'bg-[#c84b31]/20 text-[#f87171] border border-[#c84b31]/40'
                : 'bg-[#5c8a5c]/20 text-[#78be78] border border-[#5c8a5c]/40'
            }`}
          >
            {statusMsg}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-[rgba(237,227,208,0.1)] flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#d9a15c] text-[#0f0e0d] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#c48e4b] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Submitting to AI Pipeline...' : 'Submit Evidence Dossier'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
