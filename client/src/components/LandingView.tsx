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

// Reusable progress row animated with anime.js
const ProgressRow: React.FC<{ label: string; pct: number; delay?: number }> = ({
  label,
  pct,
  delay = 0,
}) => {
  const barRef = useProgressBar(pct, { duration: 1100, delay });

  return (
    <div>
      <div className="flex justify-between text-xs text-[#ede3d0] mb-1 font-mono">
        <span className="text-[#a8a29b]">{label}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="w-full bg-[#0f0e0d] h-1.5 rounded overflow-hidden">
        <div
          ref={barRef}
          className="bg-gradient-to-r from-[#d9a15c] to-[#f5c78e] h-full rounded"
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
  const figureRef = useRef<HTMLDivElement>(null);
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

    // Lady Justice avatar dramatic entrance
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

    // Hero right card composite
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

  // Floating levitation for the full Indian Lady of Justice figure
  useEffect(() => {
    if (figureRef.current) {
      anime({
        targets: figureRef.current,
        translateY: [-6, 6],
        duration: 3400,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
      });
    }
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
      title: 'GST Cross-Checker',
      icon: <FileCheck className="w-5 h-5 text-[#d9a15c]" />,
      desc: 'Automated NIC GSTR-2B API reconciliation flagging circular invoicing, shell entities, and mismatching volumes.',
      tag: 'NIC / IRIS API • GSTR-2B & GSTR-1',
    },
    {
      system: '04',
      title: 'Autonomous Escalation',
      icon: <Send className="w-5 h-5 text-[#d9a15c]" />,
      desc: 'Time-decaying state machine routing unresolved cases through Local Staff → District Collector → State Level → CM Dashboard.',
      tag: 'Fixed SLA Clock • Zero Human Stalling',
    },
  ];

  const useCases = [
    {
      label: 'Kalaignar Kanavu Illam',
      title: 'Rural Concrete Housing Scheme',
      desc: '1,00,000 rural houses tracked across 37 districts. Photo AI verifies roof casting before final ₹2.4 Lakh DBT tranche is released.',
    },
    {
      label: 'CM Grama Salai',
      title: 'Village Connectivity & Roads',
      desc: '10,000 km rural road network. Drone and mobile GPS tracking ensures bituminous layer thickness matches billing specifications.',
    },
    {
      label: 'Smart Cities Mission',
      title: 'Tirupur Bus Stand Redevelopment',
      desc: '₹115.37 Cr multi-level terminal tracking. Automated cross-referencing between structural concrete pouring and declared GST cement invoices.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="min-h-[85vh] flex items-center pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

          {/* Left Column */}
          <div ref={heroLeftRef} className="lg:col-span-7 flex flex-col items-start">
            {/* Badge */}
            <div className="hero-anim opacity-0 inline-flex items-center gap-2 px-3.5 py-1 text-xs border border-[rgba(237,227,208,0.15)] text-[#a8a29b] mb-6 bg-[#171512] rounded-full uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-[#d9a15c] animate-ping" />
              <span>Government of Tamil Nadu • Constitutional Compliance 2026</span>
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
                <div className="relative w-24 h-24 rounded-full border-2 border-[#d9a15c]/60 overflow-hidden shadow-2xl bg-[#171512]">
                  <img
                    src="/lady-justice-avatar.jpg"
                    alt="Lady of Justice — Nidhi Kaan Logo"
                    className="w-full h-full object-cover"
                    style={{ filter: 'contrast(1.12) brightness(1.05)' }}
                  />
                  {/* Inner gold vignette */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-[#d9a15c]/40" />
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

          {/* Right Column: Lady Justice Statue + Evidence Score Card Composite */}
          <div
            ref={heroRightRef}
            className="lg:col-span-5 flex flex-col items-center justify-center opacity-0 relative"
          >
            {/* Ambient gold glow behind Lady of Justice */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-[#d9a15c]/20 via-[#c48e4b]/10 to-transparent blur-3xl pointer-events-none" />

            {/* Indian Lady of Justice Hero Figure */}
            <div
              ref={figureRef}
              className="relative z-10 w-full max-w-[320px] flex justify-center mb-[-48px]"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#d9a15c]/35 shadow-2xl bg-gradient-to-b from-[#171512] via-[#121110] to-[#0f0e0d]">
                <img
                  src="/lady-justice.jpg"
                  alt="Nyaya Devata — Indian Lady of Justice with Constitution of India"
                  className="w-full max-h-[400px] object-cover object-top hover:scale-105 transition-transform duration-700"
                  style={{ filter: 'contrast(1.12) brightness(1.05)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0d] via-transparent to-transparent opacity-85 pointer-events-none" />
                {/* Floating caption badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#0f0e0d]/90 border border-[#d9a15c]/40 text-[9px] font-mono text-[#d9a15c] backdrop-blur-sm">
                  ⚖ CONSTITUTION OF INDIA
                </div>
              </div>
            </div>

            {/* Evidence Score Card Overlaid */}
            <div
              className="relative z-20 w-full max-w-md stitch-card p-6 border-[#d9a15c]/35 backdrop-blur-md bg-[#141312]/95"
              style={{ boxShadow: '0 12px 40px -10px rgba(0,0,0,0.8), 0 0 30px -5px rgba(217,161,92,0.2)' }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[rgba(237,227,208,0.1)] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/lady-justice-avatar.jpg"
                    alt="logo"
                    className="w-7 h-7 rounded-full object-cover border border-[#d9a15c]/50"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#ede3d0] block">
                      TN-EVI-2026-8841
                    </span>
                    <span className="text-[9px] font-mono text-[#d9a15c]">
                      CONSTITUTIONAL COMPLIANCE PASS
                    </span>
                  </div>
                </div>
                <span className="stitch-badge-green px-2.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#78be78] animate-ping" />
                  VERIFIED
                </span>
              </div>

              {/* Score */}
              <div className="text-center py-2">
                <div className="text-5xl font-mono font-bold text-[#ede3d0] tracking-tight">
                  <span ref={scoreRef}>0</span>
                  <span className="text-xl text-[#d9a15c]">%</span>
                </div>
                <div className="text-[10px] text-[#a8a29b] mt-0.5 font-mono uppercase tracking-wider">
                  Composite Evidence Confidence Score
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-2.5 mt-3 border-t border-[rgba(237,227,208,0.08)] pt-3">
                <ProgressRow label="Location Consistency (Live GPS EXIF)" pct={92} delay={700} />
                <ProgressRow label="Image Forensics (ELA & pHash)" pct={85} delay={900} />
                <ProgressRow label="GST Invoice Match (GSTR-2B)" pct={79} delay={1100} />
              </div>

              <div className="mt-4 pt-2.5 border-t border-[rgba(237,227,208,0.08)] flex items-center justify-between text-[11px] text-[#a8a29b] font-mono">
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
            src="/lady-justice-avatar.jpg"
            alt="Nidhi Kaan"
            className="w-10 h-10 rounded-full object-cover border border-[#d9a15c]/40 flex-shrink-0"
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
      <section className="relative overflow-hidden rounded-lg border border-[#d9a15c]/25 bg-[#141312] p-10 text-center">
        {/* BG Lady Justice watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
          <img
            src="/lady-justice.jpg"
            alt="Constitution of India Lady Justice"
            className="w-96 h-96 object-contain"
          />
        </div>
        <div className="relative z-10">
          <div className="text-[11px] font-mono text-[#d9a15c] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9a15c]" />
            CONSTITUTIONAL FIDUCIARY PRINCIPLE
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9a15c]" />
          </div>
          <blockquote className="text-2xl sm:text-3xl font-editorial font-light text-[#ede3d0] italic leading-relaxed max-w-2xl mx-auto">
            "Justice is not blind to the flow of public funds.
            <br />
            Under the Constitution of India, Nidhi Kaan makes every rupee accountable."
          </blockquote>
          <div className="mt-4 text-xs text-[#a8a29b] font-mono">
            — AI-BASED ANTI-CORRUPTION &amp; COMPLIANCE SYSTEM • GOVERNMENT OF TAMIL NADU • 2026
          </div>
        </div>
      </section>

    </div>
  );
};
