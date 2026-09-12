import React from 'react';
import { Shield, Eye, FileText, ArrowUpRight, Activity } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-50 bg-[#0f0e0d]/95 backdrop-blur-md border-b border-[rgba(237,227,208,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="border-l-2 border-[#d9a15c] pl-3">
            <div className="font-tamil text-2xl font-bold text-[#ede3d0] leading-tight flex items-center gap-2">
              <span>நிதி கண்</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-[#d9a15c]/40 text-[#d9a15c] bg-[#171512]">
                PROTOTYPE 2026
              </span>
            </div>
            <div className="text-[10px] text-[#d9a15c] font-medium tracking-[0.25em] -mt-0.5">
              NIDHI KAAN • EVIDENCE ENGINE
            </div>
          </div>
        </div>

        {/* Center: Navigation Pills */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#171512] p-1.5 rounded-full border border-[rgba(237,227,208,0.1)]">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'landing'
                ? 'bg-[#ede3d0] text-[#0f0e0d] font-semibold'
                : 'text-[#a8a29b] hover:text-[#ede3d0]'
            }`}
          >
            {lang === 'ta' ? 'அறிமுகம் / Overview' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-[#ede3d0] text-[#0f0e0d] font-semibold'
                : 'text-[#a8a29b] hover:text-[#ede3d0]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {lang === 'ta' ? 'கண்காணிப்பகம் / Dashboard' : 'Dashboard'}
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'cases'
                ? 'bg-[#ede3d0] text-[#0f0e0d] font-semibold'
                : 'text-[#a8a29b] hover:text-[#ede3d0]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {lang === 'ta' ? 'வழக்குகள் / Case Inspector' : 'Case Inspector'}
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'submit'
                ? 'bg-[#ede3d0] text-[#0f0e0d] font-semibold'
                : 'text-[#a8a29b] hover:text-[#ede3d0]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {lang === 'ta' ? 'புதிய பதிவு / New Case' : 'New Case'}
          </button>
          <button
            onClick={() => setActiveTab('gst')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'gst'
                ? 'bg-[#ede3d0] text-[#0f0e0d] font-semibold'
                : 'text-[#a8a29b] hover:text-[#ede3d0]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {lang === 'ta' ? 'GST சரிபார்ப்பு' : 'GST Verification'}
          </button>
        </nav>

        {/* Right: Server Status + Lang Switcher */}
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
