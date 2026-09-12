import React from 'react';
import {
  Shield,
  Eye,
  FileCheck,
  Send,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface LandingViewProps {
  onExploreCases: () => void;
  onOpenSubmit: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onExploreCases,
  onOpenSubmit,
}) => {
  return (
    <div className="space-y-16 animate-fadeIn pb-16">
      {/* Hero Section */}
      <section className="min-h-[75vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs border border-[rgba(237,227,208,0.15)] text-[#a8a29b] mb-6 bg-[#171512] rounded-full uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-[#d9a15c] animate-ping" />
              <span>Government of Tamil Nadu Prototype • 2026</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold font-tamil text-[#ede3d0] leading-tight tracking-tight mb-2">
              நிதி கண்
            </h1>
            <div className="text-2xl font-medium text-[#d9a15c] tracking-wide mb-1 font-editorial italic">
              Nidhi Kaan — The Fund's Eye
            </div>
            <div className="text-sm text-[#a8a29b] tracking-widest uppercase font-mono mb-6">
              AI-BASED GOVERNMENT FUND UTILIZATION &amp; COMPLIANCE SYSTEM
            </div>

            <p className="text-lg sm:text-xl text-[#ede3d0]/90 font-light leading-relaxed mb-8 max-w-xl">
              Before public money moves, Nidhi Kaan verifies the ground evidence. Replacing slow manual inspection with geo-locked photo checks, CV stage progress, GST bill cross-checks, and auto-escalation to the CM’s desk.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={onOpenSubmit}
                className="bg-[#d9a15c] text-[#0f0e0d] font-bold px-7 py-3.5 rounded hover:bg-[#c48e4b] transition-all text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>Submit Evidence Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreCases}
                className="border border-[rgba(237,227,208,0.2)] text-[#ede3d0] px-7 py-3.5 rounded hover:border-[#d9a15c] hover:text-[#d9a15c] transition-all text-xs uppercase tracking-wider flex items-center justify-center"
              >
                Inspect Live Cases
              </button>
            </div>
          </div>

          {/* Right Hero Column: Lady Justice Emblem & Live Verification Score Preview */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md stitch-card p-6 gold-glow border-[#d9a15c]/30">
              <div className="flex items-center justify-between border-b border-[rgba(237,227,208,0.1)] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#d9a15c]" />
                  <span className="text-xs font-mono font-bold uppercase text-[#ede3d0]">
                    TN-EVI-2026-8841
                  </span>
                </div>
                <span className="stitch-badge-green px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">
                  VERIFIED 87%
                </span>
              </div>

              <div className="text-center py-4">
                <div className="text-6xl font-mono font-bold text-[#ede3d0] tracking-tight">
                  87<span className="text-2xl text-[#d9a15c]">%</span>
                </div>
                <div className="text-xs text-[#a8a29b] mt-1 font-mono uppercase tracking-wider">
                  Composite Evidence Confidence Score
                </div>
              </div>

              <div className="space-y-3 mt-4 border-t border-[rgba(237,227,208,0.08)] pt-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[#a8a29b] mb-1 text-[11px]">
                    <span>Location Consistency (EXIF)</span>
                    <span className="text-[#d9a15c]">92%</span>
                  </div>
                  <div className="w-full bg-[#141312] h-1.5 rounded">
                    <div className="bg-[#d9a15c] h-full rounded" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#a8a29b] mb-1 text-[11px]">
                    <span>Image Integrity (ELA &amp; pHash)</span>
                    <span className="text-[#d9a15c]">85%</span>
                  </div>
                  <div className="w-full bg-[#141312] h-1.5 rounded">
                    <div className="bg-[#d9a15c] h-full rounded" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#a8a29b] mb-1 text-[11px]">
                    <span>Temporal &amp; GST Match</span>
                    <span className="text-[#d9a15c]">79%</span>
                  </div>
                  <div className="w-full bg-[#141312] h-1.5 rounded">
                    <div className="bg-[#d9a15c] h-full rounded" style={{ width: '79%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[rgba(237,227,208,0.08)] flex items-center justify-between text-[11px] text-[#a8a29b] font-mono">
                <span>Pilot: Tiruppur Bus Stand</span>
                <span className="text-[#78be78]">✓ GSTR-2B Sealed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section className="space-y-6">
        <div className="border-b border-[rgba(237,227,208,0.1)] pb-4">
          <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest">
            FOUR-LAYER SYSTEM ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-editorial font-light text-[#ede3d0] mt-1">
            Independent AI Modules Feeding Autonomous Escalation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Layer 1 */}
          <div className="stitch-card p-6 stitch-card-hover flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#d9a15c] uppercase mb-2">System 01</div>
              <h3 className="font-bold text-sm text-[#ede3d0] mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#d9a15c]" />
                <span>Authenticity AI</span>
              </h3>
              <p className="text-xs text-[#a8a29b] leading-relaxed">
                Gatekeeper rejecting synthetic photos, spoofed GPS coordinates, and duplicate photos via pHash and ELA.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(237,227,208,0.08)] text-[10px] text-[#a8a29b] font-mono">
              Forced In-App Camera • Live EXIF
            </div>
          </div>

          {/* Layer 2 */}
          <div className="stitch-card p-6 stitch-card-hover flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#d9a15c] uppercase mb-2">System 02</div>
              <h3 className="font-bold text-sm text-[#ede3d0] mb-2 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#d9a15c]" />
                <span>Progress CV Engine</span>
              </h3>
              <p className="text-xs text-[#a8a29b] leading-relaxed">
                Fine-tuned EfficientNet-B4 classifying civil stages (Foundation, Plinth, Roof, Finishing) against tender DPR.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(237,227,208,0.08)] text-[10px] text-[#a8a29b] font-mono">
              Delta Progress • Multi-Temporal
            </div>
          </div>

          {/* Layer 3 */}
          <div className="stitch-card p-6 stitch-card-hover flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#d9a15c] uppercase mb-2">System 03</div>
              <h3 className="font-bold text-sm text-[#ede3d0] mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#d9a15c]" />
                <span>GST Cross-Check</span>
              </h3>
              <p className="text-xs text-[#a8a29b] leading-relaxed">
                Direct GSTN API cross-check confirming supplier GSTR-1 filings, site volume requirements, and invoice uniqueness.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(237,227,208,0.08)] text-[10px] text-[#a8a29b] font-mono">
              GSTR-2B Matching • Duplicate Hash
            </div>
          </div>

          {/* Layer 4 */}
          <div className="stitch-card p-6 stitch-card-hover flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#d9a15c] uppercase mb-2">System 04</div>
              <h3 className="font-bold text-sm text-[#ede3d0] mb-2 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-[#d9a15c]" />
                <span>Auto-Escalation</span>
              </h3>
              <p className="text-xs text-[#a8a29b] leading-relaxed">
                Deterministic SLA timers bumping stagnant files across Local Staff → District → State → CM Dashboard without human intervention.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(237,227,208,0.08)] text-[10px] text-[#a8a29b] font-mono">
              Tamil Notice Engine • CM Review
            </div>
          </div>
        </div>
      </section>

      {/* Scheme Agnostic Use Cases */}
      <section className="stitch-card p-8">
        <div className="border-b border-[rgba(237,227,208,0.1)] pb-4 mb-6">
          <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest">
            STATEWIDE SCHEME DEPLOYMENTS
          </div>
          <h2 className="text-2xl font-editorial font-light text-[#ede3d0] mt-1">
            Built Once — Applicable Across Every Tamil Nadu Department
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-[#141312] p-5 border border-[rgba(237,227,208,0.08)] rounded">
            <span className="text-[#d9a15c] font-mono uppercase font-bold text-[10px] block mb-2">
              Use Case A • Rural Development
            </span>
            <div className="font-bold text-sm text-[#ede3d0] mb-2">
              Kalaignarin Kanavu Illam / Housing
            </div>
            <p className="text-[#a8a29b] leading-relaxed">
              Tranches disbursed milestone by milestone. Field visiting officers are held accountable through mandatory geo-photo check-ins, eliminating ghost inspections.
            </p>
          </div>

          <div className="bg-[#141312] p-5 border border-[rgba(237,227,208,0.08)] rounded">
            <span className="text-[#d9a15c] font-mono uppercase font-bold text-[10px] block mb-2">
              Use Case B • Highways &amp; Municipal
            </span>
            <div className="font-bold text-sm text-[#ede3d0] mb-2">
              Urban Road Repair &amp; Pothole Paving
            </div>
            <p className="text-[#a8a29b] leading-relaxed">
              Citizens crowdsource damaged asphalt coordinates. Contractors must submit post-work photos matching the precise GPS polygon before contract sign-off.
            </p>
          </div>

          <div className="bg-[#141312] p-5 border border-[rgba(237,227,208,0.08)] rounded">
            <span className="text-[#d9a15c] font-mono uppercase font-bold text-[10px] block mb-2">
              Use Case C • MAWS Department
            </span>
            <div className="font-bold text-sm text-[#ede3d0] mb-2">
              Tirupur Bus Stand Redevelopment
            </div>
            <p className="text-[#a8a29b] leading-relaxed">
              ₹115.37 Cr multi-level terminal tracking. Automated cross-referencing between structural concrete pouring and declared GST cement procurement invoices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
