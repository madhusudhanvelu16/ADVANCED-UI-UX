import React from 'react';
import { useSafety } from '../context/SafetyContext';
import { Smartphone, Monitor, Wifi, Battery, Volume2, Moon } from 'lucide-react';

export default function DeviceWrapper({ children }) {
  const {
    deviceFrameMode,
    setDeviceFrameMode,
    student,
    sosState,
    appTheme,
    changeTheme,
    NIGHT_THEMES
  } = useSafety();

  const isDuress = sosState === 'duress';
  const isSosActive = (sosState === 'queued' || sosState === 'transmitting' || sosState === 'sent' || sosState === 'acknowledged') && !isDuress;

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col items-center justify-start selection:bg-rose-500/30 selection:text-white transition-colors duration-300 theme-${appTheme} theme-app-bg`}>
      {/* Top Academic & Presentation Banner */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-bold text-slate-200">SafeRide Mobility Project</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300/90">
            <span>{student.name}</span>
            <span className="text-slate-500">({student.regNo})</span>
          </div>
        </div>

        {/* Viewport Mode & Quick Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Quick Theme Switcher Pills */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
            <span className="text-slate-500 px-1.5 flex items-center gap-1">
              <Moon className="w-3 h-3 text-cyan-400" />
              <span>Theme:</span>
            </span>
            {NIGHT_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                  appTheme === t.id
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={t.desc}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accent }} />
                <span>{t.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Device Frame Viewport Toggle */}
          <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceFrameMode('mobile_frame')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                deviceFrameMode === 'mobile_frame'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Mockup View (Recommended for Demo)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
            <button
              onClick={() => setDeviceFrameMode('responsive')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                deviceFrameMode === 'responsive'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Responsive View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Wide View</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8">
        {deviceFrameMode === 'mobile_frame' ? (
          /* Realistic Smartphone Outer Shell */
          <div className="relative w-full max-w-[412px] h-[92vh] max-h-[890px] min-h-[700px] theme-app-bg rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[8px] border-slate-800/90 flex flex-col overflow-hidden ring-1 ring-slate-700/50">
            
            {/* Phone Speaker Notch & Dynamic Island */}
            <div className="relative w-full bg-midnight-950/95 pt-2.5 px-6 pb-1 flex items-center justify-between text-xs text-slate-400 select-none border-b border-slate-900/60 z-50">
              <span className="font-semibold text-slate-300 font-mono text-[11px]">11:45 PM</span>
              
              {/* Dynamic Island Pill */}
              <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-300 ${
                isSosActive ? 'bg-rose-950/80 border border-rose-500/40 text-rose-300' : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isSosActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                }`} />
                <span className="text-[10px] font-mono tracking-tight">
                  {isSosActive ? 'SOS DISPATCH' : 'GPS LOCKED'}
                </span>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-slate-400">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">5G</span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Inner App Content Screen */}
            <div className={`relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden theme-app-bg theme-${appTheme}`}>
              {children}
            </div>

            {/* Home Indicator Bar */}
            <div className="w-full theme-app-bg py-1.5 flex justify-center items-center z-50 select-none">
              <div className="w-32 h-1 bg-slate-700/70 rounded-full" />
            </div>
          </div>
        ) : (
          /* Wide Responsive Layout */
          <div className={`w-full max-w-4xl min-h-[85vh] theme-app-bg theme-${appTheme} rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col overflow-hidden`}>
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
