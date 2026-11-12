import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import MapComponent from '../components/MapComponent';
import {
  Navigation,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock,
  Shield,
  MapPin,
  Sparkles,
  Volume2
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen9RideMonitoring() {
  const navigate = useNavigate();
  const {
    ride,
    isDeviated,
    isStopped,
    simulateRouteDeviation,
    simulateUnscheduledStop,
    activateSilentSOS,
    aiPromptOpen,
    setAiPromptOpen,
    aiPromptDetails,
    addLog
  } = useSafety();

  const handleIAmSafe = () => {
    soundEffects.playTactileClick();
    setAiPromptOpen(false);
    addLog("Passenger Confirmed Safe", "Prompt dismissed by passenger ('I am OK - Regular traffic/stop').", "safe");
  };

  const handleTriggerSOSNow = () => {
    soundEffects.playTactileClick();
    setAiPromptOpen(false);
    activateSilentSOS('ai_prompt_manual_sos');
    navigate('/silent-sos');
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Ride Monitoring & AI Shield</h2>
          </div>
          <p className="text-xs text-slate-400">Autonomous Route & Inactivity Safeguard</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">
          AI Shield Active
        </span>
      </div>

      {/* Map visualization */}
      <div className="w-full h-60 sm:h-64 rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
        <MapComponent height="100%" interactive={true} />
      </div>

      {/* AI Telemetry Watchdog Card */}
      <div className="p-3.5 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white">Autonomous Anomaly Detection</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Sampling @ 1Hz</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`p-2.5 rounded-xl border transition-colors ${
            isDeviated
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              : 'bg-midnight-950 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[10px] font-mono uppercase block text-slate-400">Route Deviation</span>
            <span className="font-bold">{isDeviated ? 'Diverged (450m Off-Path)' : 'Following Geo-corridor'}</span>
          </div>

          <div className={`p-2.5 rounded-xl border transition-colors ${
            isStopped
              ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
              : 'bg-midnight-950 border-slate-800 text-slate-300'
          }`}>
            <span className="text-[10px] font-mono uppercase block text-slate-400">Motion State</span>
            <span className="font-bold">{isStopped ? 'Halted (>3 min stationary)' : `Cruising @ ${ride.metrics.currentSpeedKmh} km/h`}</span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="p-3.5 rounded-2xl bg-midnight-900/90 border border-slate-800/90 space-y-2">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
          Simulate Night Anomalies (Demonstration)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={simulateRouteDeviation}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Detour</span>
          </button>
          <button
            onClick={simulateUnscheduledStop}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Unplanned Stop</span>
          </button>
        </div>
      </div>

      {/* Quick SOS Trigger */}
      <button
        onClick={() => {
          soundEffects.playTactileClick();
          activateSilentSOS('ride_monitoring_quick');
          navigate('/silent-sos');
        }}
        className="w-full py-3 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
        <span>Activate Silent SOS Immediately</span>
      </button>

      {/* DISCREET ASSISTANCE CHECK POPUP (MODAL) */}
      {aiPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-midnight-950 border border-amber-500/60 rounded-3xl p-5 shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{aiPromptDetails.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {aiPromptDetails.message}
              </p>
            </div>

            {/* Countdown Ring / Pill */}
            <div className="py-2">
              <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 font-mono text-xs font-bold border border-rose-800/60 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Auto-SOS in {aiPromptDetails.secondsLeft}s</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                If unconfirmed, Silent SOS activates automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleIAmSafe}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                I am Safe (Normal)
              </button>
              <button
                onClick={handleTriggerSOSNow}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Need Help (SOS)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
