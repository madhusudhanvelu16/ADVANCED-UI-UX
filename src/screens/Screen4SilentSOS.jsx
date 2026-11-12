import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import {
  ShieldAlert,
  Radio,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowLeft,
  EyeOff,
  AlertTriangle,
  Lock,
  Cpu,
  KeyRound
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen4SilentSOS() {
  const navigate = useNavigate();
  const {
    sosState,
    alertTimestamp,
    alertTelemetry,
    dispatcherName,
    ride,
    setStealthDisguise
  } = useSafety();

  const handleReturnToRide = () => {
    soundEffects.playTactileClick();
    navigate('/ride');
  };

  const handleGoToPin = () => {
    soundEffects.playTactileClick();
    navigate('/false-alarm');
  };

  // State progression check
  const isQueued = sosState === 'queued';
  const isTransmitting = sosState === 'transmitting';
  const isSent = sosState === 'sent';
  const isAcknowledged = sosState === 'acknowledged';

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto select-none">
      {/* Top Warning Banner (Notice: Completely Silent, zero audio siren!) */}
      <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Silent Distress Signal Active
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-200">
            AUDIO MUTED
          </span>
        </div>
        <p className="text-xs text-rose-200/90 leading-tight">
          No alarm or siren sound is playing to avoid alerting the driver. Real-time telemetry is streaming silently to the SafeRide response command center.
        </p>
      </div>

      {/* Alert Transmission Pipeline (Queued -> Sent -> Acknowledged) */}
      <div className="p-4 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Emergency Transmission Pipeline
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {/* Step 1: Queued */}
          <div className="relative flex items-start gap-3">
            <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              sosState !== 'idle' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              ✓
            </span>
            <div>
              <h4 className="text-xs font-semibold text-white">Alert Queued & Encrypted</h4>
              <p className="text-[10px] text-slate-400">Telemetry packaged with 256-bit AES encryption</p>
            </div>
          </div>

          {/* Step 2: Transmitting / Sent */}
          <div className="relative flex items-start gap-3">
            <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              isSent || isAcknowledged ? 'bg-emerald-500 text-white' : isTransmitting ? 'bg-amber-500 animate-ping text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {isSent || isAcknowledged ? '✓' : '2'}
            </span>
            <div>
              <h4 className="text-xs font-semibold text-white">Dispatched to 24/7 Command Center</h4>
              <p className="text-[10px] text-slate-400">
                {isSent || isAcknowledged ? 'Handshake received by Bengaluru Regional Safety Hub' : 'Broadcasting packet via multi-carrier fallback...'}
              </p>
            </div>
          </div>

          {/* Step 3: Acknowledged */}
          <div className="relative flex items-start gap-3">
            <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              isAcknowledged ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {isAcknowledged ? '✓' : '3'}
            </span>
            <div>
              <h4 className="text-xs font-semibold text-white">Safety Officer Acknowledged</h4>
              <p className="text-[10px] text-slate-400">
                {isAcknowledged
                  ? (dispatcherName || 'Dispatcher Officer Assigned (Badge #BLR-409)')
                  : 'Awaiting responder assignment (simulating 5s SLA)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Shared Telemetry Packet */}
      <div className="p-3.5 rounded-2xl bg-midnight-900 border border-slate-800 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2 mb-2">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" /> Shared Telemetry
          </span>
          <span className="text-[10px] text-slate-500">Live GPS Stream</span>
        </div>
        <div className="space-y-1 text-slate-300 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Current GPS:</span>
            <span className="text-cyan-300 font-bold">{ride.currentCoord[0].toFixed(5)}, {ride.currentCoord[1].toFixed(5)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Vehicle / Plate:</span>
            <span>{ride.driver.vehicle} ({ride.driver.plate})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Driver Name:</span>
            <span>{ride.driver.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Speed / Accuracy:</span>
            <span>{ride.metrics.currentSpeedKmh} km/h · ±3.2m</span>
          </div>
        </div>
      </div>

      {/* Academic Simulation Notice */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Academic Demonstration:</strong> All alerts, officers, and telemetry feeds are simulated for college UI/UX evaluation. No real 112 emergency units are contacted.
        </span>
      </div>

      {/* Discreet Navigation & Stealth Action Options */}
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-2 gap-2">
          {/* Return to Ride (Stealth View) */}
          <button
            onClick={handleReturnToRide}
            className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Ride</span>
          </button>

          {/* Calculator Camouflage */}
          <button
            onClick={() => {
              setStealthDisguise('calculator');
              navigate('/ride');
            }}
            className="py-3 px-3 rounded-xl bg-midnight-900 hover:bg-slate-800 text-cyan-400 border border-cyan-800/40 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
          >
            <EyeOff className="w-4 h-4" />
            <span>Camouflage Calc</span>
          </button>
        </div>

        {/* Enter Security PIN to cancel or trigger Duress */}
        <button
          onClick={handleGoToPin}
          className="w-full py-3 px-4 rounded-xl bg-midnight-900 hover:bg-slate-850 border border-slate-700/80 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>Enter Security PIN (Cancel or Duress Mode)</span>
        </button>
      </div>
    </div>
  );
}
