import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import {
  Shield,
  Eye,
  FileCheck,
  Send,
  ArrowRight,
} from 'lucide-react';
import { useStaggerFadeIn, useProgressBar } from '../hooks/useAnime';

interface LandingViewProps {
  onExploreCases: () => void;
  onOpenSubmit: () => void;
}

// Animated progress bar row
const ProgressRow: React.FC<{ label: string; pct: number; delay: number }> = ({
  label,
  pct,
  delay,
}) => {
  const barRef = useProgressBar(pct, delay);
  return (
    <div>
      <div className="flex justify-between text-[#a8a29b] mb-1 text-[11px] font-mono">
        <span>{label}</span>
        <span className="text-[#d9a15c]">{pct}%</span>
      </div>
      <div className="w-full bg-[#141312] h-1.5 rounded overflow-hidden">
        <div
          ref={barRef}
          className="bg-gradient-to-r from-[#d9a15c] to-[#f7bb74] h-full rounded"
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
};

export const LandingView: React.FC<LandingViewProps> = ({
  onExploreCases,
  onOpenSubmit,
}) => {
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const heroRightRef = useRef<HTMLDivElement>(null);
  const ladyRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useStaggerFadeIn('.pillar-card', { delay: 90, translateY: 32 });
  const useCasesRef = useStaggerFadeIn('.use-case-card', { delay: 70 });

  // Counter for the score number
  const scoreRef = useRef<HTMLSpanElement>(null);

  // Hero left text stagger
  useEffect(() => {
    if (heroLeftRef.current) {
      const els = heroLeftRef.current.querySelectorAll('.hero-anim');
      anime({
        targets: els,
        opacity: [0, 1],
        translateY: [40, 0],
        delay: anime.stagger(100, { start: 100 }),
        duration: 800,
        easing: 'easeOutExpo',
      });
    }

    // Lady Justice dramatic entrance
    if (ladyRef.current) {
      anime({
        targets: ladyRef.current,
        opacity: [0, 1],
        translateY: [-30, 0],
        scale: [0.85, 1],
        duration: 1200,
        delay: 300,
        easing: 'easeOutElastic(1, .55)',
      });
    }

    // Hero right card
    if (heroRightRef.current) {
      anime({
        targets: heroRightRef.current,
        opacity: [0, 1],
        translateX: [40, 0],
        duration: 900,
        delay: 400,
        easing: 'easeOutExpo',
      });
    }

    // Score counter
    if (scoreRef.current) {
      const el = scoreRef.current;
      const obj = { val: 0 };
      anime({
        targets: obj,
        val: 87,
        duration: 1600,
        delay: 700,
        easing: 'easeOutExpo',
        round: 1,
        update() {
          el.textContent = obj.val.toString();
        },
      });
    }
  }, []);

  // Floating Lady Justice glow pulse (continuous)
  useEffect(() => {
    const glowEl = document.querySelector('#lady-glow') as HTMLElement;
    if (!glowEl) return;
    anime({
      targets: glowEl,
      opacity: [0.15, 0.45],
      scale: [1, 1.08],
      duration: 2800,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });
  }, []);

  const pillars = [
    {
      system: '01',
      title: 'Authenticity AI',
      icon: <Shield className="w-5 h-5 text-[#d9a15c]" />,
      desc: 'Gatekeeper rejecting synthetic photos, spoofed GPS coordinates, and duplicate images via pHash and ELA.',
      tag: 'Forced In-App Camera • Live EXIF',
    },
    {
      system: '02',
      title: 'Progress CV Engine',
      icon: <Eye className="w-5 h-5 text-[#d9a15c]" />,
      desc: 'Fine-tuned EfficientNet-B4 classifying civil stages (Foundation→Plinth→Roof→Finishing) against tender DPR.',
      tag: 'Delta Progress • Multi-Temporal',
    },
    {
      system: '03',
      title: 'GST Cross-Check',
      icon: <FileCheck className="w-5 h-5 text-[#d9a15c]" />,
      desc: 'Direct GSTN API confirming supplier GSTR-1 filings, site volume requirements, and invoice uniqueness.',
      tag: 'GSTR-2B Matching • Duplicate Hash',
    },
    {
      system: '04',
      title: 'Auto-Escalation',
      icon: <Send className="w-5 h-5 text-[#d9a15c]" />,
      desc: 'SLA timers bumping stagnant files: Local Staff → District → State → CM Dashboard, without human intervention.',
      tag: 'Tamil Notice Engine • CM Review',
    },
  ];

  const useCases = [
    {
      label: 'Use Case A • Rural Development',
      title: 'Kalaignarin Kanavu Illam / Housing',
      desc: 'Tranches disbursed milestone by milestone. Officers accountable through mandatory geo-photo check-ins, eliminating ghost inspections.',
    },
    {
      label: 'Use Case B • Highways & Municipal',
      title: 'Urban Road Repair & Pothole Paving',
      desc: 'Citizens crowdsource damaged asphalt coordinates. Contractors must submit post-work photos matching precise GPS polygon before sign-off.',
    },
    {
      label: 'Use Case C • MAWS Department',
      title: 'Tirupur Bus Stand Redevelopment',
      desc: '₹115.37 Cr multi-level terminal tracking. Automated cross-referencing between structural concrete pouring and declared GST cement invoices.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="min-h-[80vh] flex items-center pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

          {/* Left Column */}
          <div ref={heroLeftRef} className="lg:col-span-7 flex flex-col items-start">
            {/* Badge */}
            <div className="hero-anim opacity-0 inline-flex items-center gap-2 px-3 py-1 text-xs border border-[rgba(237,227,208,0.15)] text-[#a8a29b] mb-6 bg-[#171512] rounded-full uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-[#d9a15c] animate-ping" />
              <span>Government of Tamil Nadu Prototype • 2026</span>
            </div>

            {/* Lady Justice + Title row */}
            <div className="flex items-center gap-5 mb-3">
              <div
                ref={ladyRef}
                className="relative opacity-0 flex-shrink-0"
              >
                {/* Radial glow behind */}
                <div
                  id="lady-glow"
                  className="absolute -inset-4 rounded-full bg-[#d9a15c]/20 blur-xl pointer-events-none"
                />
                <div className="relative w-24 h-24 rounded-full border-2 border-[#d9a15c]/50 overflow-hidden shadow-2xl">
                  <img
                    src="/lady-justice.webp"
                    alt="Lady of Justice — Nidhi Kaan"
                    className="w-full h-full object-cover"
                    style={{ filter: 'sepia(15%) brightness(0.9) contrast(1.1)' }}
                  />
                  {/* Inner gold vignette */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#d9a15c]/30" />
                </div>
              </div>

              <div>
                <h1 className="hero-anim opacity-0 text-6xl sm:text-7xl font-bold font-tamil text-[#ede3d0] leading-tight tracking-tight">
                  நிதி கண்
                </h1>
                <div className="hero-anim opacity-0 text-2xl font-medium text-[#d9a15c] tracking-wide mt-1 font-editorial italic">
                  Nidhi Kaan — The Fund's Eye
                </div>
              </div>
            </div>

            <div className="hero-anim opacity-0 text-sm text-[#a8a29b] tracking-widest uppercase font-mono mb-6">
              AI-BASED GOVERNMENT FUND UTILIZATION &amp; COMPLIANCE SYSTEM
            </div>

            <p className="hero-anim opacity-0 text-lg sm:text-xl text-[#ede3d0]/85 font-light leading-relaxed mb-8 max-w-xl">
              Before public money moves, Nidhi Kaan verifies the ground evidence.
              Replacing slow manual inspection with geo-locked photo checks, CV stage
              progress, GST bill cross-checks, and auto-escalation to the CM's desk.
            </p>

            <div className="hero-anim opacity-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenSubmit}
                className="bg-[#d9a15c] text-[#0f0e0d] font-bold px-7 py-3.5 rounded hover:bg-[#c48e4b] active:scale-95 transition-all text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Submit Evidence Dossier</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onExploreCases}
                className="border border-[rgba(237,227,208,0.2)] text-[#ede3d0] px-7 py-3.5 rounded hover:border-[#d9a15c] hover:text-[#d9a15c] active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center justify-center"
              >
                Inspect Live Cases
              </button>
            </div>
          </div>

          {/* Right Column: Evidence Score Card */}
          <div
            ref={heroRightRef}
            className="lg:col-span-5 flex justify-center items-center opacity-0"
          >
            <div className="relative w-full max-w-md stitch-card p-6 border-[#d9a15c]/30"
              style={{ boxShadow: '0 0 40px -8px rgba(217,161,92,0.2)' }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[rgba(237,227,208,0.1)] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src="/lady-justice.webp"
                    alt="logo"
                    className="w-7 h-7 rounded-full object-cover border border-[#d9a15c]/40"
                    style={{ filter: 'sepia(20%) brightness(0.9)' }}
                  />
                  <span className="text-xs font-mono font-bold uppercase text-[#ede3d0]">
                    TN-EVI-2026-8841
                  </span>
                </div>
                <span className="stitch-badge-green px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">
                  VERIFIED
                </span>
              </div>

              {/* Score */}
              <div className="text-center py-4">
                <div className="text-6xl font-mono font-bold text-[#ede3d0] tracking-tight">
                  <span ref={scoreRef}>0</span>
                  <span className="text-2xl text-[#d9a15c]">%</span>
                </div>
                <div className="text-xs text-[#a8a29b] mt-1 font-mono uppercase tracking-wider">
                  Composite Evidence Confidence Score
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-3 mt-4 border-t border-[rgba(237,227,208,0.08)] pt-4">
                <ProgressRow label="Location Consistency (EXIF)" pct={92} delay={700} />
                <ProgressRow label="Image Integrity (ELA & pHash)" pct={85} delay={900} />
                <ProgressRow label="Temporal & GST Match" pct={79} delay={1100} />
              </div>

              <div className="mt-5 pt-3 border-t border-[rgba(237,227,208,0.08)] flex items-center justify-between text-[11px] text-[#a8a29b] font-mono">
                <span>Pilot: Tiruppur Bus Stand</span>
                <span className="text-[#78be78]">✓ GSTR-2B Sealed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 Core AI Pillars ────────────────────────────────── */}
      <section ref={pillarsRef} className="space-y-6">
        <div className="border-b border-[rgba(237,227,208,0.1)] pb-4">
          <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest">
            FOUR-LAYER SYSTEM ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-editorial font-light text-[#ede3d0] mt-1">
            Independent AI Modules Feeding Autonomous Escalation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p) => (
            <div
              key={p.system}
              className="pillar-card opacity-0 stitch-card p-6 flex flex-col justify-between
                         hover:border-[#d9a15c]/40 hover:-translate-y-1 transition-all duration-300
                         hover:shadow-[0_0_24px_-4px_rgba(217,161,92,0.18)]"
            >
              <div>
                <div className="text-[10px] font-mono text-[#d9a15c] uppercase mb-2">System {p.system}</div>
                <h3 className="font-bold text-sm text-[#ede3d0] mb-2 flex items-center gap-1.5">
                  {p.icon}
                  <span>{p.title}</span>
                </h3>
                <p className="text-xs text-[#a8a29b] leading-relaxed">{p.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[rgba(237,227,208,0.08)] text-[10px] text-[#a8a29b] font-mono">
                {p.tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use Cases ────────────────────────────────────────── */}
      <section ref={useCasesRef} className="stitch-card p-8">
        <div className="border-b border-[rgba(237,227,208,0.1)] pb-4 mb-6 flex items-center gap-4">
          <img
            src="/lady-justice.webp"
            alt="Nidhi Kaan"
            className="w-10 h-10 rounded-full object-cover border border-[#d9a15c]/40 flex-shrink-0"
            style={{ filter: 'sepia(20%) brightness(0.9)' }}
          />
          <div>
            <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest">
              STATEWIDE SCHEME DEPLOYMENTS
            </div>
            <h2 className="text-2xl font-editorial font-light text-[#ede3d0] mt-0.5">
              Built Once — Applicable Across Every Tamil Nadu Department
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {useCases.map((uc) => (
            <div
              key={uc.label}
              className="use-case-card opacity-0 bg-[#141312] p-5 border border-[rgba(237,227,208,0.08)] rounded
                         hover:border-[#d9a15c]/30 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-[#d9a15c] font-mono uppercase font-bold text-[10px] block mb-2">
                {uc.label}
              </span>
              <div className="font-bold text-sm text-[#ede3d0] mb-2">{uc.title}</div>
              <p className="text-[#a8a29b] leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Justice Quote Banner ─────────────────────────────── */}
      <section className="relative overflow-hidden rounded-lg border border-[#d9a15c]/20 bg-[#141312] p-10 text-center">
        {/* BG Lady Justice watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <img
            src="/lady-justice.webp"
            alt=""
            className="w-80 h-80 object-cover rounded-full"
          />
        </div>
        <div className="relative z-10">
          <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest mb-4">
            FOUNDING PRINCIPLE
          </div>
          <blockquote className="text-2xl sm:text-3xl font-editorial font-light text-[#ede3d0] italic leading-relaxed max-w-2xl mx-auto">
            "Justice is not blind to the flow of public funds.
            <br />
            Nidhi Kaan makes every rupee accountable."
          </blockquote>
          <div className="mt-4 text-xs text-[#a8a29b] font-mono">
            — AI-BASED ANTI-CORRUPTION SYSTEM • GOVERNMENT OF TAMIL NADU • 2026
          </div>
        </div>
      </section>

    </div>
  );
};
