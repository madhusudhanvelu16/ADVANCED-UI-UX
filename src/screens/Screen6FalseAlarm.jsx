import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Info
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen6FalseAlarm() {
  const navigate = useNavigate();
  const {
    normalPin,
    duressPin,
    handlePinSubmit,
    sosState
  } = useSafety();

  const [enteredPin, setEnteredPin] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'duress' | 'error', text: '' }

  const handleKeyPress = (digit) => {
    soundEffects.playTactileClick();
    if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    soundEffects.playTactileClick();
    setEnteredPin(prev => prev.slice(0, -1));
    setFeedback(null);
  };

  const verifyPin = (pinToTest) => {
    const result = handlePinSubmit(pinToTest);
    if (result.mode === 'duress') {
      setFeedback({
        type: 'duress',
        text: 'Ride Monitored. Alert status normalized.'
      });
      setTimeout(() => {
        navigate('/duress-mode');
      }, 1200);
    } else if (result.mode === 'normal') {
      setFeedback({
        type: 'success',
        text: 'False alarm recorded. Dispatcher silent review initiated.'
      });
      setTimeout(() => {
        navigate('/ride');
      }, 1800);
    } else {
      setFeedback({
        type: 'error',
        text: 'Invalid security PIN. Please try again.'
      });
      setTimeout(() => {
        setEnteredPin('');
      }, 1000);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">False Alarm Management</h2>
        </div>
        <p className="text-xs text-slate-400">
          Deactivate accidental SOS alert using your 4-digit Safety PIN.
        </p>
      </div>

      {/* Safety Protocol Card */}
      <div className="p-3.5 rounded-xl bg-midnight-900 border border-slate-800 text-xs text-slate-300">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">Safety Verification Protocol:</strong> Entering your normal PIN notifies safety dispatch that the alert was triggered accidentally. Response units remain on standby until silent verification is complete.
          </div>
        </div>
      </div>

      {/* PIN Dots Display */}
      <div className="my-auto py-4 flex flex-col items-center">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
          Enter 4-Digit Safety PIN
        </span>

        <div className="flex items-center gap-4 mb-4">
          {[0, 1, 2, 3].map((i) => {
            const hasChar = enteredPin.length > i;
            return (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  hasChar
                    ? 'bg-cyan-400 border-cyan-400 scale-110 shadow-lg shadow-cyan-500/40'
                    : 'bg-transparent border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className={`p-2.5 rounded-xl text-xs font-medium text-center animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
              : feedback.type === 'duress'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
              : 'bg-rose-950/50 text-rose-300 border border-rose-800'
          }`}>
            {feedback.text}
          </div>
        )}

        <div className="text-[11px] text-slate-500 font-mono mt-2">
          Demo Default PIN: <strong className="text-slate-300">1234</strong> (or <strong className="text-rose-400">9999</strong> for Duress)
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto w-full mb-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleKeyPress(digit)}
            className="py-3 rounded-2xl bg-midnight-900 hover:bg-slate-800 active:scale-95 text-lg font-bold text-slate-100 border border-slate-800 shadow-sm transition-all"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => {
            soundEffects.playTactileClick();
            setEnteredPin('');
            setFeedback(null);
          }}
          className="py-3 rounded-2xl bg-midnight-900/60 hover:bg-slate-800 active:scale-95 text-xs font-mono text-slate-400 border border-slate-800/80 transition-all"
        >
          Clear
        </button>
        <button
          onClick={() => handleKeyPress('0')}
          className="py-3 rounded-2xl bg-midnight-900 hover:bg-slate-800 active:scale-95 text-lg font-bold text-slate-100 border border-slate-800 shadow-sm transition-all"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="py-3 rounded-2xl bg-midnight-900/60 hover:bg-slate-800 active:scale-95 text-xs font-mono text-slate-400 border border-slate-800/80 transition-all"
        >
          ⌫
        </button>
      </div>

      {/* Quick shortcuts for college evaluators */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={() => {
            setEnteredPin(normalPin);
            verifyPin(normalPin);
          }}
          className="text-emerald-400 hover:underline flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Auto-fill Normal PIN ({normalPin})</span>
        </button>
        <button
          onClick={() => {
            setEnteredPin(duressPin);
            verifyPin(duressPin);
          }}
          className="text-rose-400 hover:underline flex items-center gap-1"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Auto-fill Duress PIN ({duressPin})</span>
        </button>
      </div>
    </div>
  );
}
