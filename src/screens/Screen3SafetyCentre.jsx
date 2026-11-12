import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import {
  ShieldAlert,
  Share2,
  PhoneCall,
  AlertTriangle,
  Radio,
  CheckCircle2,
  X,
  Phone,
  MessageSquare,
  Lock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { UNSAFE_DRIVING_REASONS } from '../data/mockRideData';
import { soundEffects } from '../utils/soundEffects';

export default function Screen3SafetyCentre() {
  const navigate = useNavigate();
  const {
    activateSilentSOS,
    holdDurationSec,
    contacts,
    ride,
    addLog,
    sosState
  } = useSafety();

  // 1.5-Second Hold State for SOS Button
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const holdIntervalRef = useRef(null);

  // Modals
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [call112ModalOpen, setCall112ModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Simulation notification banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Hold gesture handler (1.5 seconds)
  const startHold = () => {
    soundEffects.playTactileClick();
    setHolding(true);
    setHoldProgress(0);

    const stepMs = 50;
    const totalMs = holdDurationSec * 1000;
    const increment = (stepMs / totalMs) * 100;

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(holdIntervalRef.current);
          setHolding(false);
          // Trigger Silent SOS!
          activateSilentSOS('safety_center_hold_1.5s');
          navigate('/silent-sos');
          return 100;
        }
        return prev + increment;
      });
    }, stepMs);
  };

  const endHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setHolding(false);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Quick Call Trusted Contact simulation
  const handleCallTrusted = (contact) => {
    soundEffects.playTactileClick();
    addLog("Simulated Call", `Encrypted safety call initiated to ${contact.name} (${contact.phone})`, "safe");
    showToast(`Simulated Call: Connecting to ${contact.name} (${contact.phone})...`);
  };

  // Quick SMS Share simulation
  const handleShareLiveLocation = () => {
    soundEffects.playTactileClick();
    addLog("Live Location Shared", `Encrypted tracking token shared with ${contacts.length} trusted contacts`, "safe");
    setShareModalOpen(true);
  };

  // Unsafe Driving Report submission
  const handleReportSubmit = () => {
    soundEffects.playTactileClick();
    setReportSubmitted(true);
    addLog(
      "Unsafe Driving Report",
      `Driver ${ride.driver.name} reported for: ${selectedReasons.join(', ')}`,
      "warning"
    );
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setSelectedReasons([]);
      showToast("Report received by SafeRide 24/7 Monitoring Desk.");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Safety Centre
          </h2>
          <p className="text-xs text-slate-400">Night-Time Protection Hub · Real-Time Telemetry</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
          Shield Active
        </span>
      </div>

      {/* Toast popup */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs shadow-xl animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* ACTION 1: SILENT SOS WITH 1.5-SECOND HOLD GESTURE */}
      <div className="p-4 rounded-2xl bg-midnight-900 border border-rose-900/50 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-mono text-[10px] uppercase font-bold border border-rose-800/50">
                Action 1
              </span>
              <h3 className="text-sm font-bold text-white">Silent SOS Trigger</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Press & hold for <strong>{holdDurationSec}s</strong> to activate discreet emergency dispatch.
            </p>
          </div>
          <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
        </div>

        {/* Hold Button with Progress Ring */}
        <div className="flex flex-col items-center justify-center py-2">
          <div
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer select-none transition-transform active:scale-95 shadow-2xl ${
              holding ? 'scale-95' : ''
            }`}
          >
            {/* Background Circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-700 to-rose-950 opacity-90 blur-[2px]" />

            {/* SVG Radial Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="50"
                className="text-slate-800/60"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="50"
                className="text-white transition-all duration-75"
                strokeWidth="6"
                strokeDasharray={314}
                strokeDashoffset={314 - (314 * holdProgress) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Core SOS Label */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white mb-0.5" />
              <span className="text-xs font-black tracking-wider text-white">
                {holding ? `${Math.round(holdProgress)}%` : 'HOLD SOS'}
              </span>
              <span className="text-[9px] text-rose-200">
                {holding ? 'Keep holding...' : '1.5 Sec'}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 text-center">
            {holding ? 'Activating silent distress signal...' : 'Touch & hold to prevent false trigger'}
          </span>
        </div>
      </div>

      {/* ACTIONS 2 - 5 LIST */}
      <div className="space-y-2.5">
        {/* Action 2: Share Live Location */}
        <button
          onClick={handleShareLiveLocation}
          className="w-full p-3.5 rounded-xl bg-midnight-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-left transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Share Live Location
                </h4>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400">
                  256-bit Encrypted
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Broadcast live GPS route to family in real-time</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
        </button>

        {/* Action 3: Contact Trusted Person */}
        <div className="p-3.5 rounded-xl bg-midnight-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-white">Contact Trusted Person</h4>
            </div>
            <button
              onClick={() => navigate('/contacts')}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              Manage ({contacts.length})
            </button>
          </div>

          <div className="space-y-1.5">
            {contacts.slice(0, 2).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded-lg bg-midnight-950 border border-slate-800/80"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-200">{c.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2">{c.relation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCallTrusted(c)}
                    className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40"
                    title="Simulate Safe Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      soundEffects.playTactileClick();
                      showToast(`Simulated SMS sent to ${c.name}: "Tracking my ride via SafeRide"`);
                    }}
                    className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800/40"
                    title="Simulate SMS Alert"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action 4: Call Emergency Services (Manual 112) */}
        <button
          onClick={() => setCall112ModalOpen(true)}
          className="w-full p-3.5 rounded-xl bg-midnight-900 hover:bg-slate-850 border border-rose-900/40 flex items-center justify-between text-left transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/50">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-rose-200 group-hover:text-rose-100 transition-colors">
                  Call Emergency Helpline (112)
                </h4>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                  National 112
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Manual emergency police & ambulance bridge</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400">112</span>
        </button>

        {/* Action 5: Report Unsafe Driving */}
        <button
          onClick={() => setReportModalOpen(true)}
          className="w-full p-3.5 rounded-xl bg-midnight-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-left transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Report Unsafe Driving
              </h4>
              <p className="text-[10px] text-slate-400">Log speeding, suspicious detour, or driver harassment</p>
            </div>
          </div>
          <span className="text-[10px] text-amber-400 font-medium">Report</span>
        </button>
      </div>

      {/* SHARE LOCATION MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-midnight-950 border border-slate-700 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" /> Share Live Trip
              </h3>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Simulated real-time tracking token generated. In production, this broadcasts via SMS/WhatsApp without sharing personal identity.
            </p>
            <div className="p-2.5 rounded-xl bg-midnight-900 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all mb-4">
              https://saferide.secure/track/{ride.id}?token=enc_89f0a7
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  showToast("Simulated WhatsApp link sent to trusted contacts");
                  setShareModalOpen(false);
                }}
                className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
              >
                Send via WhatsApp
              </button>
              <button
                onClick={() => {
                  showToast("Simulated SMS broadcast initiated");
                  setShareModalOpen(false);
                }}
                className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
              >
                Send via SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 112 CALL CONFIRMATION MODAL */}
      {call112ModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-midnight-950 border border-rose-700/80 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-rose-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500" /> Emergency Hotline 112
              </h3>
              <button onClick={() => setCall112ModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-200 mb-3 leading-relaxed">
              <strong>Simulated Emergency Action:</strong> In a production environment, clicking this connects your handset directly to India's National Emergency Response System (112).
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              No real telephone calls or notifications are dispatched during this academic presentation.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCall112ModalOpen(false)}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  soundEffects.playTactileClick();
                  setCall112ModalOpen(false);
                  showToast("Simulated 112 Bridge: Cellular call handshake simulated.");
                }}
                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Simulate Call 112
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNSAFE DRIVING REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-midnight-950 border border-slate-700 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Report Unsafe Driving
              </h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Select any safety concerns. This report is sent silently to the SafeRide safety squad.
            </p>

            <div className="space-y-2 mb-4">
              {UNSAFE_DRIVING_REASONS.map((reason) => {
                const isSelected = selectedReasons.includes(reason.label);
                return (
                  <div
                    key={reason.id}
                    onClick={() => {
                      setSelectedReasons(prev =>
                        isSelected ? prev.filter(r => r !== reason.label) : [...prev, reason.label]
                      );
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/60 text-slate-100'
                        : 'bg-midnight-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{reason.label}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{reason.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={selectedReasons.length === 0}
                className="flex-1 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
              >
                {reportSubmitted ? 'Submitting...' : 'Send Silent Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
