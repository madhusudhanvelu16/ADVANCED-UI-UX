import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  Terminal,
  Play,
  AlertTriangle,
  Radio,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  HelpCircle,
  FileText
} from 'lucide-react';
import DuressComparisonModal from './DuressComparisonModal';

export default function DevDock() {
  const {
    student,
    sosState,
    ride,
    isDeviated,
    isStopped,
    normalPin,
    duressPin,
    dispatcherName,
    alertTelemetry,
    activateSilentSOS,
    simulateRouteDeviation,
    simulateUnscheduledStop,
    simulateDispatcherAck,
    handlePinSubmit,
    resetRide,
    activityLogs,
    devPanelOpen,
    setDevPanelOpen
  } = useSafety();

  const [showComparison, setShowComparison] = useState(false);
  const [activeTab, setActiveTab] = useState('actions'); // 'actions' | 'telemetry' | 'audit'

  if (!devPanelOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setDevPanelOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-midnight-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-2xl backdrop-blur-lg transition-all hover:scale-105 active:scale-95 text-xs font-mono"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Demo Control Center</span>
        </button>
      </div>
    );
  }

  const isDuress = sosState === 'duress';

  return (
    <>
      <aside className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 z-50 w-full sm:w-[460px] max-h-[85vh] bg-midnight-950/95 border border-slate-700/80 rounded-t-2xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col overflow-hidden text-xs font-sans">
        {/* Panel Header */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white tracking-tight">SafeRide Evaluator Panel</h3>
                <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px]">
                  v1.0-LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {student.name} · {student.regNo} · {student.domain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowComparison(true)}
              title="Dual PIN Concept Explainer"
              className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-950/30 border border-amber-500/20"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevPanelOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Internal State Banner (The most important part of Duress Mode!) */}
        <div className={`px-4 py-2 border-b transition-colors ${
          isDuress
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
            : sosState !== 'idle'
            ? 'bg-amber-950/70 border-amber-500/40 text-amber-200'
            : 'bg-midnight-900 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Internal System State
            </span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
              isDuress
                ? 'bg-rose-600 text-white animate-pulse'
                : sosState === 'idle'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                : 'bg-amber-900 text-amber-300'
            }`}>
              {isDuress ? 'CRITICAL DURESS (COVERT DISPATCH)' : sosState.toUpperCase()}
            </span>
          </div>

          {isDuress && (
            <div className="text-[11px] leading-tight text-rose-200 bg-rose-900/40 p-2 rounded-lg border border-rose-500/30">
              <strong>High-Priority Duress Active!</strong> The passenger's screen is disguised as a normal ride to deceive an attacker, while emergency units are receiving silent live coordinates.
            </div>
          )}

          {!isDuress && sosState === 'false_alarm_review' && (
            <div className="text-[11px] leading-tight text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-700/40">
              <strong>False Alarm Reported (Normal PIN 1234).</strong> Dispatcher callback protocol initiated.
            </div>
          )}
        </div>

        {/* Panel Tabs */}
        <div className="flex border-b border-slate-800 bg-midnight-950 px-2 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'actions' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Demo Triggers
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'telemetry' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Telemetry
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'audit' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Log ({activityLogs.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[380px]">
          {activeTab === 'actions' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => activateSilentSOS('dev_quick_sos')}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 flex flex-col items-start gap-1 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-rose-400 group-hover:text-rose-200">
                    <Radio className="w-3.5 h-3.5" /> Trigger Silent SOS
                  </div>
                  <span className="text-[10px] text-slate-400">Instant background dispatch</span>
                </button>

                <button
                  onClick={simulateRouteDeviation}
                  className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/50 flex flex-col items-start gap-1 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400 group-hover:text-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" /> Route Deviation
                  </div>
                  <span className="text-[10px] text-slate-400">Divert off main highway</span>
                </button>

                <button
                  onClick={simulateUnscheduledStop}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 flex flex-col items-start gap-1 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Unscheduled Stop
                  </div>
                  <span className="text-[10px] text-slate-400">Simulate stationary vehicle</span>
                </button>

                <button
                  onClick={simulateDispatcherAck}
                  className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-800/50 flex flex-col items-start gap-1 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dispatcher Ack
                  </div>
                  <span className="text-[10px] text-slate-400">Command Center locks in</span>
                </button>
              </div>

              {/* PIN Testing Suite */}
              <div className="p-3 rounded-xl bg-midnight-900 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-2">
                  PIN Verification Simulation
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handlePinSubmit(normalPin)}
                    className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1.5 text-xs font-medium transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enter Normal PIN ({normalPin})</span>
                  </button>

                  <button
                    onClick={() => handlePinSubmit(duressPin)}
                    className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 flex items-center gap-1.5 text-xs font-medium transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Enter Duress PIN ({duressPin})</span>
                  </button>
                </div>
              </div>

              {/* Reset application */}
              <button
                onClick={resetRide}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-2 text-xs font-mono transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Demo State (11:32 PM Sample Ride)</span>
              </button>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-2 font-mono text-[11px] text-slate-300 bg-midnight-900 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Ride ID:</span>
                <span className="text-cyan-400 font-semibold">{ride.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Vehicle:</span>
                <span>{ride.driver.vehicle} ({ride.driver.plate})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Driver:</span>
                <span>{ride.driver.name} ({ride.driver.rating} ★)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">GPS Coordinates:</span>
                <span className="text-cyan-400">{ride.currentCoord[0].toFixed(4)}, {ride.currentCoord[1].toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Speed / Battery:</span>
                <span>{ride.metrics.currentSpeedKmh} km/h · {ride.metrics.batteryPercent}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Assigned Dispatcher:</span>
                <span className="text-slate-200">{dispatcherName || 'Pending queue assignment'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Silent Audio Channel:</span>
                <span className={sosState !== 'idle' ? 'text-emerald-400' : 'text-slate-500'}>
                  {sosState !== 'idle' ? 'STREAMING (256-bit encrypted)' : 'STANDBY'}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-2 font-mono">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-midnight-900 border border-slate-800/80 text-[11px]"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-200">{log.event}</span>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight">{log.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Dual PIN Modal */}
      <DuressComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </>
  );
}
