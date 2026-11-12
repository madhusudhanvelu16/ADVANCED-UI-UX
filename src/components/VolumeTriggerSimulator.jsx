import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, Info } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { soundEffects } from '../utils/soundEffects';

export default function VolumeTriggerSimulator() {
  const { activateSilentSOS, volumeTriggerEnabled } = useSafety();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleVolumeDownPress = () => {
    if (!volumeTriggerEnabled) return;
    soundEffects.playTactileClick();

    const now = Date.now();
    let newCount = 1;

    // Must be clicked 3 times within 2 seconds
    if (now - lastClickTime < 1800) {
      newCount = clickCount + 1;
    }

    setClickCount(newCount);
    setLastClickTime(now);

    if (newCount >= 3) {
      setClickCount(0);
      activateSilentSOS('hardware_volume_down_triple');
    }
  };

  // Optional keyboard shortcut listener: Pressing 'v' or 'V' three times triggers it
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'v' || e.key === 'V') {
        handleVolumeDownPress();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clickCount, lastClickTime, volumeTriggerEnabled]);

  return (
    <div className="p-4 rounded-2xl bg-midnight-900 border border-slate-800/80 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Hardware Button Simulator</h4>
            <span className="text-[10px] text-amber-400 font-mono">
              [Simulation Label: Virtual Browser Hook]
            </span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
          Shortcut: 'V' key
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
        In pocket stealth mode, passengers cannot look at their screen. Rapidly pressing
        <strong className="text-slate-200"> Volume Down 3 times</strong> discreetly broadcasts coordinates without lighting up the display.
      </p>

      {/* Interactive Volume Rocker */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleVolumeDownPress}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all shadow-sm"
          >
            <span>Click Vol (-)</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 font-mono text-[11px]">
              {clickCount}/3
            </span>
          </button>
          <span className="text-[11px] text-slate-500">
            {clickCount === 0 && "Press 3 times quickly"}
            {clickCount === 1 && "1 registered (tap 2 more)"}
            {clickCount === 2 && "2 registered (tap 1 more!)"}
          </span>
        </div>

        {clickCount > 0 && (
          <div className="flex gap-1">
            <span className={`w-2 h-2 rounded-full ${clickCount >= 1 ? 'bg-cyan-400' : 'bg-slate-800'}`} />
            <span className={`w-2 h-2 rounded-full ${clickCount >= 2 ? 'bg-cyan-400' : 'bg-slate-800'}`} />
            <span className={`w-2 h-2 rounded-full ${clickCount >= 3 ? 'bg-rose-500 animate-ping' : 'bg-slate-800'}`} />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-start gap-1.5 text-[10px] text-slate-500">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 mt-0.5" />
        <span>Hardware key event is mapped via standard Web Audio & keydown listener for seamless cross-platform evaluation.</span>
      </div>
    </div>
  );
}
