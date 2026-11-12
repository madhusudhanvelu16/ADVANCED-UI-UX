import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import VolumeTriggerSimulator from '../components/VolumeTriggerSimulator';
import {
  Radio,
  Fingerprint,
  Smartphone,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Info,
  Shield,
  HelpCircle
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen5DiscreetTriggers() {
  const navigate = useNavigate();
  const {
    triggerGesture,
    setTriggerGesture,
    holdDurationSec,
    setHoldDurationSec,
    volumeTriggerEnabled,
    setVolumeTriggerEnabled,
    activateSilentSOS,
    addLog
  } = useSafety();

  // Gesture testing sandbox
  const [testTapCount, setTestTapCount] = useState(0);
  const [testSuccess, setTestSuccess] = useState(false);
  const testTimerRef = useRef(null);

  // 1.5s Long Press tester
  const [testHoldProgress, setTestHoldProgress] = useState(0);
  const testHoldIntervalRef = useRef(null);
  const [holdSuccess, setHoldSuccess] = useState(false);

  // Tap tester for repeated gestures
  const handleTestTap = () => {
    soundEffects.playTactileClick();
    const count = testTapCount + 1;
    setTestTapCount(count);

    if (testTimerRef.current) clearTimeout(testTimerRef.current);

    if (count >= 3) {
      setTestTapCount(0);
      setTestSuccess(true);
      activateSilentSOS('discreet_secret_tap_sandbox');
      setTimeout(() => setTestSuccess(false), 3000);
    } else {
      testTimerRef.current = setTimeout(() => {
        setTestTapCount(0);
      }, 1200);
    }
  };

  const startTestHold = () => {
    soundEffects.playTactileClick();
    setTestHoldProgress(0);
    setHoldSuccess(false);

    const step = 50;
    const total = holdDurationSec * 1000;
    const inc = (step / total) * 100;

    testHoldIntervalRef.current = setInterval(() => {
      setTestHoldProgress((p) => {
        if (p + inc >= 100) {
          clearInterval(testHoldIntervalRef.current);
          setHoldSuccess(true);
          activateSilentSOS('discreet_hold_tester');
          setTimeout(() => setHoldSuccess(false), 3000);
          return 100;
        }
        return p + inc;
      });
    }, step);
  };

  const endTestHold = () => {
    if (testHoldIntervalRef.current) clearInterval(testHoldIntervalRef.current);
    setTestHoldProgress(0);
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <EyeOff className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Discreet Emergency Triggers</h2>
        </div>
        <p className="text-xs text-slate-400">
          Activate SOS without lighting up screen or alerting the driver.
        </p>
      </div>

      {/* Trigger 1: Long Press SOS (1.5s) */}
      <div className="p-4 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">1. Long-Press SOS Button</h3>
              <p className="text-[10px] text-slate-400">Hold threshold: {holdDurationSec}s to prevent false alerts</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
            {holdDurationSec}s
          </span>
        </div>

        {/* Hold Tester Button */}
        <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-midnight-950 border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">Test Long-Press</span>
            <span className="text-[10px] text-slate-500">
              {holdSuccess ? '✓ Silent SOS Dispatched!' : 'Press & hold the button below'}
            </span>
          </div>

          <button
            onMouseDown={startTestHold}
            onMouseUp={endTestHold}
            onMouseLeave={endTestHold}
            onTouchStart={startTestHold}
            onTouchEnd={endTestHold}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
              holdSuccess ? 'bg-emerald-600' : 'bg-rose-600 active:scale-95'
            }`}
          >
            {holdSuccess ? 'Dispatched' : testHoldProgress > 0 ? `${Math.round(testHoldProgress)}%` : 'Hold (1.5s)'}
          </button>
        </div>
      </div>

      {/* Trigger 2: Secret Gesture / Repeated Taps */}
      <div className="p-4 rounded-2xl bg-midnight-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">2. Configurable Secret Gesture</h3>
              <p className="text-[10px] text-slate-400">Silent tap sequence hidden in plain sight</p>
            </div>
          </div>
        </div>

        {/* Gesture options */}
        <div className="space-y-2 my-3">
          {[
            { id: 'triple_tap_logo', title: 'Triple-Tap Top SafeRide Logo', desc: 'Tap the top-left shield 3 times in quick succession' },
            { id: 'quad_tap_map', title: 'Quad-Tap Center of Route Map', desc: 'Tap anywhere on the dark map area 4 times' },
            { id: 'double_shake', title: 'Simulated Rapid Phone Shake', desc: 'Accelerate handset back and forth twice' }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => {
                soundEffects.playTactileClick();
                setTriggerGesture(item.id);
                addLog("Secret Gesture Updated", `Preferred gesture set to: ${item.title}`, "info");
              }}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                triggerGesture === item.id
                  ? 'bg-cyan-950/40 border-cyan-500/60 text-white'
                  : 'bg-midnight-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{item.title}</span>
                {triggerGesture === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Gesture Test Box */}
        <div
          onClick={handleTestTap}
          className={`p-3.5 rounded-xl border border-dashed cursor-pointer text-center transition-all ${
            testSuccess
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
              : 'bg-midnight-950/80 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-xs font-semibold block">
            {testSuccess ? '✓ Triple-Tap Secret Trigger Confirmed!' : 'Tap this box 3 times rapidly to test'}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block font-mono">
            Taps: {testTapCount}/3
          </span>
        </div>
      </div>

      {/* Trigger 3: Hardware Volume Button Simulator */}
      <VolumeTriggerSimulator />
    </div>
  );
}
