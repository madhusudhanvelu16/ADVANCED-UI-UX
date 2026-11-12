import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import {
  Settings,
  KeyRound,
  ShieldAlert,
  Sparkles,
  Users,
  Shield,
  EyeOff,
  CheckCircle2,
  Lock,
  Phone,
  HelpCircle,
  FileText,
  Moon
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen10SafetySettings() {
  const navigate = useNavigate();
  const {
    normalPin,
    setNormalPin,
    duressPin,
    setDuressPin,
    triggerGesture,
    setTriggerGesture,
    autoSafetyChecks,
    setAutoSafetyChecks,
    holdDurationSec,
    setHoldDurationSec,
    volumeTriggerEnabled,
    setVolumeTriggerEnabled,
    student,
    addLog,
    appTheme,
    changeTheme,
    NIGHT_THEMES
  } = useSafety();

  const [editingNormal, setEditingNormal] = useState(false);
  const [editingDuress, setEditingDuress] = useState(false);
  const [tempNormalPin, setTempNormalPin] = useState(normalPin);
  const [tempDuressPin, setTempDuressPin] = useState(duressPin);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveNormalPin = (e) => {
    e.preventDefault();
    if (tempNormalPin.length === 4 && /^\d+$/.test(tempNormalPin)) {
      if (tempNormalPin === duressPin) {
        showToast("Error: Normal PIN cannot be identical to Duress PIN!");
        return;
      }
      setNormalPin(tempNormalPin);
      setEditingNormal(false);
      addLog("PIN Configured", "Normal Safety PIN updated securely.", "safe");
      showToast("Normal Safety PIN saved successfully.");
    } else {
      showToast("PIN must be exactly 4 digits.");
    }
  };

  const handleSaveDuressPin = (e) => {
    e.preventDefault();
    if (tempDuressPin.length === 4 && /^\d+$/.test(tempDuressPin)) {
      if (tempDuressPin === normalPin) {
        showToast("Error: Duress PIN cannot be identical to Normal PIN!");
        return;
      }
      setDuressPin(tempDuressPin);
      setEditingDuress(false);
      addLog("Duress PIN Configured", "Emergency Duress PIN updated securely.", "warning");
      showToast("Duress PIN saved successfully.");
    } else {
      showToast("PIN must be exactly 4 digits.");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Safety Settings</h2>
        </div>
        <p className="text-xs text-slate-400">Security PINs, Discreet Gestures & Night Ergonomics</p>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs shadow-xl animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* SECTION: NIGHT & DARK THEMES (MOBILITY ERGONOMICS) */}
      <div className="p-4 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-cyan-400" />
            Night & Dark Themes (Cab Stealth Modes)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 font-mono">
            Active: {NIGHT_THEMES.find(t => t.id === appTheme)?.name}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          In a dark vehicle at night, screen reflection draws the driver's eyes in the rear-view mirror. Choose specialized scotopic, OLED, or high-contrast night profiles to keep your activity concealed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {NIGHT_THEMES.map((theme) => {
            const isSelected = appTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  changeTheme(theme.id);
                  showToast(`Applied ${theme.name} Theme`);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 bg-slate-800/90 ring-1 ring-cyan-500/40 shadow-lg'
                    : 'border-slate-800 bg-midnight-950 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
                      />
                      <span className="text-xs font-bold text-white">{theme.name}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-slate-900 text-slate-300 border border-slate-800">
                      {theme.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {theme.desc}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{theme.subtitle}</span>
                  {isSelected ? (
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  ) : (
                    <span className="text-slate-400 hover:text-white">Click to apply</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: SECURITY PINS */}
      <div className="p-4 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          Dual PIN Security Architecture
        </h3>

        {/* Normal Safety PIN */}
        <div className="p-3 rounded-xl bg-midnight-950 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Normal Safety PIN</span>
              <span className="text-[10px] text-slate-400">Used to confirm accidental / false alarms</span>
            </div>
            {!editingNormal ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-mono text-xs font-bold border border-emerald-900/40">
                  •••• ({normalPin})
                </span>
                <button
                  onClick={() => {
                    setTempNormalPin(normalPin);
                    setEditingNormal(true);
                  }}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Edit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNormalPin} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={tempNormalPin}
                  onChange={(e) => setTempNormalPin(e.target.value)}
                  className="w-16 px-2 py-1 rounded bg-slate-900 border border-cyan-500 text-xs text-center font-mono text-white focus:outline-none"
                />
                <button type="submit" className="px-2 py-1 bg-cyan-600 text-white rounded text-xs font-bold">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNormal(false)}
                  className="text-xs text-slate-500"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Duress Emergency PIN */}
        <div className="p-3 rounded-xl bg-midnight-950 border border-rose-900/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-rose-300 block">Duress Emergency PIN</span>
                <span className="text-[9px] px-1 rounded bg-rose-950 text-rose-300 border border-rose-800/40 font-mono">
                  Coercion
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Fakes cancellation on screen while silently dispatching police
              </span>
            </div>
            {!editingDuress ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-rose-400 font-mono text-xs font-bold border border-rose-900/40">
                  •••• ({duressPin})
                </span>
                <button
                  onClick={() => {
                    setTempDuressPin(duressPin);
                    setEditingDuress(true);
                  }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Edit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveDuressPin} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={tempDuressPin}
                  onChange={(e) => setTempDuressPin(e.target.value)}
                  className="w-16 px-2 py-1 rounded bg-slate-900 border border-rose-500 text-xs text-center font-mono text-white focus:outline-none"
                />
                <button type="submit" className="px-2 py-1 bg-rose-600 text-white rounded text-xs font-bold">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDuress(false)}
                  className="text-xs text-slate-500"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: TRIGGER GESTURES & HOLD TIME */}
      <div className="p-4 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <EyeOff className="w-4 h-4 text-cyan-400" />
          Discreet Trigger Customization
        </h3>

        {/* Hold threshold */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950 border border-slate-800 text-xs">
          <div>
            <span className="font-semibold text-white block">SOS Hold Threshold</span>
            <span className="text-[10px] text-slate-400">Hold duration to avoid accidental press</span>
          </div>
          <div className="flex items-center gap-1">
            {[1.0, 1.5, 2.0].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  soundEffects.playTactileClick();
                  setHoldDurationSec(sec);
                }}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  holdDurationSec === sec
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Hardware volume button toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950 border border-slate-800 text-xs">
          <div>
            <span className="font-semibold text-white block">Simulated Volume Down Trigger</span>
            <span className="text-[10px] text-slate-400">Triple-press volume down in pocket</span>
          </div>
          <input
            type="checkbox"
            checked={volumeTriggerEnabled}
            onChange={(e) => setVolumeTriggerEnabled(e.target.checked)}
            className="rounded border-slate-700 text-cyan-500 focus:ring-0"
          />
        </div>
      </div>

      {/* SECTION 3: AUTOMATIC SAFETY CHECKS */}
      <div className="p-4 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Automated Watchdog Checks
        </h3>

        <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950 border border-slate-800 text-xs">
          <div>
            <span className="font-semibold text-white block">Auto Route Deviation Prompts</span>
            <span className="text-[10px] text-slate-400">Pings passenger if vehicle strays 400m off-route</span>
          </div>
          <input
            type="checkbox"
            checked={autoSafetyChecks}
            onChange={(e) => setAutoSafetyChecks(e.target.checked)}
            className="rounded border-slate-700 text-cyan-500 focus:ring-0"
          />
        </div>
      </div>

      {/* SECTION 4: PRIVACY & REGULATORY DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
        <h3 className="font-bold text-white flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-cyan-400" />
          Safety & Privacy Architecture
        </h3>
        <p className="leading-relaxed text-[11px]">
          • <strong>Simulated Demonstrations:</strong> All emergency dispatches, audio telemetry, and 112 calls are simulated locally for this academic project.
        </p>
        <p className="leading-relaxed text-[11px]">
          • <strong>Zero Audio Eavesdropping:</strong> Audio streams are strictly dummy simulated feeds and never access hardware microphones without explicit permission.
        </p>
        <p className="leading-relaxed text-[11px]">
          • <strong>Manual 112 Bridge:</strong> Real implementation uses authenticated cellular dialer integration for the Indian National Emergency Service.
        </p>
        <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[10px] text-slate-500">
          <span>Project: {student.topic}</span>
          <span>Register: {student.regNo}</span>
        </div>
      </div>
    </div>
  );
}
