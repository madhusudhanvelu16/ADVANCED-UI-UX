import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import {
  Shield,
  ShieldAlert,
  Volume2,
  VolumeX,
  Terminal,
  ArrowLeft,
  Moon,
  Sparkles,
  Check
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    sosState,
    triggerGesture,
    activateSilentSOS,
    audioFeedback,
    toggleAudio,
    devPanelOpen,
    setDevPanelOpen,
    appTheme,
    changeTheme,
    NIGHT_THEMES
  } = useSafety();

  // Secret tap counter for discreet logo trigger
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef(null);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);

  // Close theme menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    soundEffects.playTactileClick();
    if (triggerGesture === 'triple_tap_logo') {
      const nextCount = tapCount + 1;
      setTapCount(nextCount);

      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

      if (nextCount >= 3) {
        // Discreet trigger activated!
        setTapCount(0);
        activateSilentSOS('secret_logo_triple_tap');
      } else {
        tapTimerRef.current = setTimeout(() => {
          setTapCount(0);
        }, 1200);
      }
    }
  };

  const isHome = location.pathname === '/' || location.pathname === '/welcome';
  const isDuress = sosState === 'duress';
  const isSosActive = sosState === 'queued' || sosState === 'transmitting' || sosState === 'sent' || sosState === 'acknowledged';

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 bg-midnight-950/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between select-none">
      <div className="flex items-center gap-2.5">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {/* Brand Logo with Secret Tap Trigger */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
          title={triggerGesture === 'triple_tap_logo' ? "Discreet Trigger: Triple-tap this logo in an emergency" : "SafeRide Safety Shield"}
        >
          <div className="relative">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-md ${
              isSosActive && !isDuress ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-blue-600/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              {isSosActive && !isDuress ? (
                <ShieldAlert className="w-4 h-4 animate-pulse" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
            </div>
            {/* Secret tap feedback dot - almost invisible micro-dot */}
            {tapCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-60"></span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                SafeRide
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                Night Safe
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right controls: Theme Switcher, Sound toggle & Dev panel trigger */}
      <div className="flex items-center gap-1.5">
        {/* Discreet Status indicator pill */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
          isDuress
            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
            : isSosActive
            ? 'bg-rose-950/50 text-rose-300 border-rose-800/50'
            : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            isSosActive && !isDuress ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
          }`} />
          <span className="text-[11px] font-medium">
            {isDuress ? 'Ride Monitored' : isSosActive ? 'SOS Dispatched' : 'Route Protected'}
          </span>
        </div>

        {/* Night & Dark Theme Switcher Dropdown */}
        <div className="relative" ref={themeDropdownRef}>
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            title="Switch Night & Dark Theme"
            className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1 ${
              themeDropdownOpen ? 'bg-slate-800 text-cyan-300' : ''
            }`}
          >
            <Moon className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Theme Dropdown Menu */}
          {themeDropdownOpen && (
            <div className="absolute right-0 top-11 w-56 bg-midnight-950 border border-slate-700/90 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn font-sans">
              <div className="px-2.5 py-1.5 border-b border-slate-800 mb-1 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Night & Dark Themes
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 font-mono">
                  4 Modes
                </span>
              </div>

              <div className="space-y-1">
                {NIGHT_THEMES.map((theme) => {
                  const isSelected = appTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        changeTheme(theme.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border border-cyan-500/50 shadow-sm'
                          : 'hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0"
                          style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">
                              {theme.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {theme.subtitle}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Audio feedback toggle */}
        <button
          onClick={toggleAudio}
          title={audioFeedback ? "Sound & Haptic Simulation: ON" : "Sound & Haptic Simulation: OFF"}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          {audioFeedback ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Developer Console Toggle */}
        <button
          onClick={() => setDevPanelOpen(!devPanelOpen)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
            devPanelOpen
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
          }`}
          title="Toggle College Evaluation & Developer Demo Panel"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Demo Lab</span>
        </button>
      </div>
    </header>
  );
}
