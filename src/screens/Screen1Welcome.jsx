import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import {
  Shield,
  ShieldAlert,
  KeyRound,
  EyeOff,
  Navigation,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Lock
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen1Welcome() {
  const navigate = useNavigate();
  const { student, resetRide } = useSafety();

  const handleStart = () => {
    soundEffects.playTactileClick();
    resetRide();
    navigate('/ride');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-slate-100 select-none animate-fadeIn">
      {/* Top Academic Tag */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <GraduationCap className="w-4 h-4" />
          <span className="font-semibold">{student.domain}</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          {student.regNo}
        </span>
      </div>

      {/* Main Hero & Brand Section */}
      <div className="my-auto py-6 flex flex-col items-center text-center">
        {/* Pulsing Animated Shield Emblem */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-700 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-midnight-950 rounded-[22px] flex items-center justify-center border border-cyan-400/30">
              <Shield className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-rose-600 text-white shadow-lg border-2 border-midnight-950">
            <ShieldAlert className="w-4 h-4" />
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          SafeRide
        </h1>
        <p className="text-sm font-medium text-cyan-400 uppercase tracking-widest mb-3">
          Your Safety, Our Priority
        </p>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
          Night-time passenger safety system engineered for solitary commuters. Rapid discreet SOS activation, false alarm mitigation, and hostage duress protection.
        </p>

        {/* Feature Highlights Grid */}
        <div className="w-full grid grid-cols-2 gap-2.5 text-left mb-6">
          <div className="p-3 rounded-xl bg-midnight-900/80 border border-slate-800/90 shadow-sm flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Discreet Triggers</h4>
              <p className="text-[10px] text-slate-400 leading-tight">Pocket hardware & silent gestures without driver noticing.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-midnight-900/80 border border-slate-800/90 shadow-sm flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Duress PIN (9999)</h4>
              <p className="text-[10px] text-slate-400 leading-tight">Coercion mode: displays calm UI while escalating alert.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-midnight-900/80 border border-slate-800/90 shadow-sm flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">False Alarm Check</h4>
              <p className="text-[10px] text-slate-400 leading-tight">Normal PIN (1234) safely logs review without blind cancel.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-midnight-900/80 border border-slate-800/90 shadow-sm flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Route AI Shield</h4>
              <p className="text-[10px] text-slate-400 leading-tight">Detects stops & off-route diversions automatically.</p>
            </div>
          </div>
        </div>

        {/* Student Credential Banner */}
        <div className="w-full p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center justify-between">
          <span>Candidate: <strong className="text-white">{student.name}</strong></span>
          <span className="text-cyan-400 font-semibold">{student.regNo}</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Start Sample Night Ride</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[10px] text-center text-slate-500 mt-2">
          SafeRide v1.0 · Simulated 24/7 Security Architecture Demo
        </p>
      </div>
    </div>
  );
}
