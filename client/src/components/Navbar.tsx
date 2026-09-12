import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Eye, FileText, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'landing' | 'cases' | 'submit' | 'dashboard' | 'gst';
  setActiveTab: (tab: 'landing' | 'cases' | 'submit' | 'dashboard' | 'gst') => void;
  lang: 'ta' | 'en';
  setLang: (l: 'ta' | 'en') => void;
  serverOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  serverOnline,
}) => {
  const logoRef = useRef<HTMLImageElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Animate logo + brand on mount
  useEffect(() => {
    if (logoRef.current) {
      anime({
        targets: logoRef.current,
        opacity: [0, 1],
        rotate: [-8, 0],
        scale: [0.7, 1],
        duration: 1100,
        easing: 'easeOutElastic(1, .55)',
      });
    }
    if (brandRef.current) {
      anime({
        targets: brandRef.current,
        opacity: [0, 1],
        translateX: [-16, 0],
        duration: 700,
        delay: 200,
        easing: 'easeOutExpo',
      });
    }
    if (navRef.current) {
      const pills = navRef.current.querySelectorAll('button');
      anime({
        targets: pills,
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: anime.stagger(60, { start: 350 }),
        duration: 500,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  const navItems: {
    tab: 'landing' | 'cases' | 'submit' | 'dashboard' | 'gst';
    ta: string;
    en: string;
    icon?: React.ReactNode;
  }[] = [
    { tab: 'landing', ta: 'அறிமுகம்', en: 'Overview' },
    { tab: 'dashboard', ta: 'கண்காணிப்பகம்', en: 'Dashboard', icon: <Activity className="w-3.5 h-3.5" /> },
    { tab: 'cases', ta: 'வழக்குகள்', en: 'Case Inspector', icon: <Eye className="w-3.5 h-3.5" /> },
    { tab: 'submit', ta: 'புதிய பதிவு', en: 'New Case', icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    { tab: 'gst', ta: 'GST சரிபார்ப்பு', en: 'GST Verify', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0f0e0d]/95 backdrop-blur-md border-b border-[rgba(237,227,208,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Left: Lady Justice Logo + Brand */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Lady Justice Logo */}
          <div className="relative w-11 h-11 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#d9a15c]/15 border border-[#d9a15c]/30 group-hover:bg-[#d9a15c]/25 transition-colors" />
            <img
              ref={logoRef}
              src="/lady-justice.webp"
              alt="Lady Justice — Nidhi Kaan Logo"
              className="w-11 h-11 object-cover rounded-full opacity-0 relative z-10"
              style={{ filter: 'sepia(20%) brightness(0.92) contrast(1.1)' }}
            />
            {/* Gold ring pulse */}
            <div className="absolute inset-0 rounded-full border border-[#d9a15c]/40 animate-ping opacity-30 pointer-events-none" />
          </div>

          {/* Brand Text */}
          <div ref={brandRef} className="border-l-2 border-[#d9a15c] pl-3 opacity-0">
            <div className="font-tamil text-xl font-bold text-[#ede3d0] leading-tight flex items-center gap-2">
              <span className="group-hover:text-[#d9a15c] transition-colors">நிதி கண்</span>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-[#d9a15c]/40 text-[#d9a15c] bg-[#171512]">
                PROTOTYPE 2026
              </span>
            </div>
            <div className="text-[10px] text-[#d9a15c]/80 font-medium tracking-[0.2em] -mt-0.5 font-mono">
              NIDHI KAAN • EVIDENCE ENGINE
            </div>
          </div>
        </div>

        {/* Center: Nav Pills */}
        <nav
          ref={navRef}
          className="hidden lg:flex items-center space-x-1 bg-[#171512] p-1.5 rounded-full border border-[rgba(237,227,208,0.1)]"
        >
          {navItems.map(({ tab, ta, en, icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 opacity-0 ${
                activeTab === tab
                  ? 'bg-[#ede3d0] text-[#0f0e0d] font-semibold'
                  : 'text-[#a8a29b] hover:text-[#ede3d0]'
              }`}
            >
              {icon}
              {lang === 'ta' ? ta : en}
            </button>
          ))}
        </nav>

        {/* Right: Server Status + Lang */}
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono ${
              serverOnline
                ? 'border-[#5c8a5c]/40 text-[#78be78] bg-[#5c8a5c]/10'
                : 'border-yellow-700/40 text-yellow-400 bg-yellow-950/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                serverOnline ? 'bg-[#5c8a5c] animate-pulse' : 'bg-yellow-400'
              }`}
            />
            <span>{serverOnline ? 'API Connected' : 'Mock Mode'}</span>
          </div>

          <button
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            className="flex items-center border border-[rgba(237,227,208,0.15)] bg-[#171512] px-3 py-1 text-xs select-none rounded hover:border-[#d9a15c]/50 transition-colors"
          >
            <span className={lang === 'ta' ? 'text-[#d9a15c] font-semibold font-tamil' : 'text-[#a8a29b]'}>
              தமிழ்
            </span>
            <span className="mx-1 text-[#a8a29b]/40">|</span>
            <span className={lang === 'en' ? 'text-[#d9a15c] font-semibold' : 'text-[#a8a29b]'}>
              ENG
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
