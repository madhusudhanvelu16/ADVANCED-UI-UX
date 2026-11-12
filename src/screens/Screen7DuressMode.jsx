import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import MapComponent from '../components/MapComponent';
import {
  ShieldCheck,
  ShieldAlert,
  Car,
  Clock,
  MapPin,
  CheckCircle2,
  Terminal,
  Eye,
  EyeOff,
  Radio,
  Lock,
  Star
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen7DuressMode() {
  const navigate = useNavigate();
  const {
    ride,
    sosState,
    duressPin,
    handlePinSubmit,
    setDevPanelOpen
  } = useSafety();

  // Evaluator Insight Split View toggle
  const [showEvaluatorInsight, setShowEvaluatorInsight] = useState(true);

  const isDuressActive = sosState === 'duress';

  const triggerDuressDirect = () => {
    handlePinSubmit(duressPin);
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 overflow-y-auto select-none">
      {/* Top Academic Context Banner */}
      <div className="p-3 rounded-xl bg-midnight-900 border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <h2 className="font-bold text-white flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Duress Mode Architecture
          </h2>
          <p className="text-[10px] text-slate-400">Hostage / Forced Deactivation Protocol</p>
        </div>

        <button
          onClick={() => setShowEvaluatorInsight(!showEvaluatorInsight)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] transition-colors"
        >
          {showEvaluatorInsight ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showEvaluatorInsight ? 'Hide Inspector' : 'Evaluator View'}</span>
        </button>
      </div>

      {/* Evaluator Behind-the-Scenes Comparison Card */}
      {showEvaluatorInsight && (
        <div className="p-3.5 rounded-2xl bg-midnight-950 border border-cyan-800/60 shadow-xl space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-cyan-300 font-mono text-[11px] uppercase tracking-wide">
              Dual-Layer Telemetry Inspector
            </span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
              isDuressActive ? 'bg-rose-950 text-rose-300 border border-rose-500/50' : 'bg-slate-900 text-slate-400'
            }`}>
              {isDuressActive ? 'CRITICAL DURESS ACTIVE' : 'DURESS STANDBY'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* What Driver/Passenger Sees */}
            <div className="p-2.5 rounded-xl bg-midnight-900 border border-emerald-900/40">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                Passenger Screen
              </span>
              <p className="text-slate-300 leading-tight">
                Looks 100% normal. "Ride Monitored · Safe Journey". Zero red warnings.
              </p>
            </div>

            {/* What Safety Command Center Sees */}
            <div className="p-2.5 rounded-xl bg-midnight-900 border border-rose-900/40">
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">
                24/7 Command Center
              </span>
              <p className="text-slate-300 leading-tight">
                Receives HIGH PRIORITY DURESS alert. Coordinates & silent audio stream continuously!
              </p>
            </div>
          </div>

          {!isDuressActive && (
            <button
              onClick={triggerDuressDirect}
              className="w-full mt-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Enter Duress PIN ({duressPin}) Now</span>
            </button>
          )}
        </div>
      )}

      {/* THE ACTUAL PASSENGER SCREEN UNDER DURESS MODE:
          NOTICE: It looks completely calm, standard, and polite, so if the driver glances over,
          they believe the alert was deactivated! */}
      <div className="p-3.5 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md space-y-3">
        {/* Status Header: Intentionally calm green */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold text-slate-200">
              Trip In Progress · SafeRide Active
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            ETA {ride.metrics.timeRemainingMin} min
          </span>
        </div>

        {/* Route Map */}
        <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800">
          <MapComponent height="100%" interactive={false} />
        </div>

        {/* Driver Card */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
          <div className="flex items-center gap-2.5">
            <img
              src={ride.driver.photo}
              alt={ride.driver.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <h4 className="text-xs font-bold text-white">{ride.driver.name}</h4>
              <p className="text-[10px] text-slate-400">{ride.driver.vehicle} · {ride.driver.plate}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs">
            {ride.driver.rating} ★
          </span>
        </div>

        {/* Reassuring calm message */}
        <div className="p-2 rounded-xl bg-midnight-950 border border-slate-800/80 text-center text-xs text-slate-400">
          Have a comfortable journey. SafeRide is silently tracking your ride.
        </div>
      </div>

      {/* Bottom helper */}
      <div className="mt-auto pt-2 flex items-center justify-between text-xs">
        <button
          onClick={() => navigate('/ride')}
          className="text-cyan-400 hover:underline"
        >
          ← Return to Active Ride
        </button>
        <button
          onClick={() => setDevPanelOpen(true)}
          className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Inspect in Demo Lab</span>
        </button>
      </div>
    </div>
  );
}
