import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Eye, FileText, Activity, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'landing' | 'cases' | 'submit' | 'dashboard' | 'gst';
  setActiveTab: (tab: 'landing' | 'cases' | 'submit' | 'dashboard' | 'gst') => void;
  lang: 'ta' | 'en';
  setLang: (l: 'ta' | 'en') => void;
  serverOnline: boolean;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  serverOnline,
  theme,
  setTheme,
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
    {
      tab: 'submit',
      ta: 'புதிய பதிவு',
      en: 'New Case',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    { tab: 'gst', ta: 'GST சரிபார்ப்பு', en: 'GST Verify', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Left: Lady Justice Logo + Brand */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          {/* Lady Justice Logo with Mint/Ice glow ring */}
          <div className="relative w-11 h-11 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-[var(--accent-mint)]/15 border border-[var(--accent-mint)]/40 group-hover:bg-[var(--accent-mint)]/25 transition-colors" />
            <img
              ref={logoRef}
              src="/lady-justice-avatar.jpg"
              alt="Lady of Justice — Nidhi Kaan Logo"
              className="w-11 h-11 object-cover rounded-full opacity-0 relative z-10 border border-[var(--accent-mint)]/50"
              style={{ filter: 'contrast(1.15) brightness(1.05)' }}
            />
            {/* Pulsing halo */}
            <div className="absolute inset-0 rounded-full border border-[var(--accent-mint)]/50 animate-ping opacity-30 pointer-events-none" />
          </div>

          {/* Brand Text */}
          <div ref={brandRef} className="border-l-2 border-[var(--accent-mint)] pl-3 opacity-0">
            <div className="font-tamil text-xl font-bold text-[var(--text-primary)] leading-tight flex items-center gap-2">
              <span className="group-hover:text-[var(--accent-mint)] transition-colors">நிதி கண்</span>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-[var(--border-ice)] text-[var(--accent-ice)] bg-[var(--bg-subtle)]">
                PROTOTYPE 2026
              </span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-medium tracking-[0.2em] -mt-0.5 font-mono">
              NIDHI KAAN • CONSTITUTIONAL COMPLIANCE
            </div>
          </div>
        </div>

        {/* Center: Nav Pills */}
        <nav
          ref={navRef}
          className="hidden lg:flex items-center space-x-1 bg-[var(--bg-subtle)] p-1.5 rounded-full border border-[var(--border-subtle)]"
        >
          {navItems.map(({ tab, ta, en, icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 opacity-0 ${
                activeTab === tab
                  ? 'bg-[var(--accent-mint)] text-[#000000] font-bold shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {icon}
              {lang === 'ta' ? ta : en}
            </button>
          ))}
        </nav>

        {/* Right: Server Status + Lang + Theme Toggle */}
        <div className="flex items-center space-x-2.5">
          {/* Server Status */}
          <div
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono ${
              serverOnline
                ? 'border-[#8BF497]/50 text-[var(--accent-mint)] bg-[#8BF497]/15'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-subtle)]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                serverOnline ? 'bg-[#8BF497] animate-pulse' : 'bg-yellow-400'
              }`}
            />
            <span>{serverOnline ? 'API Connected' : 'Mock Mode'}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            className="flex items-center border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1 text-xs select-none rounded hover:border-[var(--accent-mint)] transition-colors"
          >
            <span className={lang === 'ta' ? 'text-[var(--accent-mint)] font-bold font-tamil' : 'text-[var(--text-muted)]'}>
              தமிழ்
            </span>
            <span className="mx-1 text-[var(--border-subtle)]">|</span>
            <span className={lang === 'en' ? 'text-[var(--accent-mint)] font-bold' : 'text-[var(--text-muted)]'}>
              ENG
            </span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center w-8 h-8 rounded border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-mint)] transition-all cursor-pointer shadow-sm group"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#8BF497] group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#0368A6] group-hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
