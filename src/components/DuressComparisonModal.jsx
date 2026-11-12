import React from 'react';
import { useSafety } from '../context/SafetyContext';
import { ShieldCheck, ShieldAlert, KeyRound, AlertTriangle, X } from 'lucide-react';

export default function DuressComparisonModal({ isOpen, onClose }) {
  const { normalPin, duressPin, handlePinSubmit } = useSafety();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-midnight-950 border border-slate-700/80 rounded-2xl shadow-2xl p-5 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Dual PIN Architecture: False Alarm vs. Duress</h3>
            <p className="text-xs text-slate-400">College UI/UX Mobility Defense Concept</p>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Normal PIN Card */}
          <div className="p-4 rounded-xl bg-midnight-900 border border-emerald-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Normal PIN
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-800/50">
                  {normalPin}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200 mb-1">Accidental / False Alarm</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Used when passenger activated SOS by mistake.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 mt-3">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Alert state set to <strong className="text-emerald-300">False Alarm Review</strong>.
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Notifies safety team: "Accidental trigger claimed".
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Does NOT cancel blindly without operator callback.
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handlePinSubmit(normalPin);
                onClose();
              }}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/40 text-xs font-semibold transition-all"
            >
              Simulate Normal PIN ({normalPin})
            </button>
          </div>

          {/* Duress PIN Card */}
          <div className="p-4 rounded-xl bg-midnight-900 border border-rose-900/50 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Duress PIN
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-xs font-bold border border-rose-800/50">
                  {duressPin}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200 mb-1">Forced Hostage / Coercion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Used when the driver aggressively demands the phone to stop the alert.
              </p>
              <ul className="text-[11px] text-slate-300 space-y-1.5 mt-3">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Screen looks 100% peaceful ("Alert Cancelled").
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <strong className="text-rose-300">Silently escalates</strong> to Police/Dispatcher!
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  High-rate GPS & silent audio streaming continue.
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handlePinSubmit(duressPin);
                onClose();
              }}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 text-xs font-semibold transition-all"
            >
              Simulate Duress PIN ({duressPin})
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Safety & Privacy Standard:</strong> Dummy PINs are strictly local for demonstration. In a production deployment, duress flags are processed through zero-knowledge encrypted HSM tokens without screen caching.
          </span>
        </div>
      </div>
    </div>
  );
}
