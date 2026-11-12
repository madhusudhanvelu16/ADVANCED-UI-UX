import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../context/SafetyContext';
import MapComponent from '../components/MapComponent';
import {
  Shield,
  ShieldAlert,
  Car,
  Clock,
  MapPin,
  ChevronRight,
  Radio,
  EyeOff,
  Star,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  Music
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function Screen2ActiveRide() {
  const navigate = useNavigate();
  const {
    ride,
    sosState,
    activateSilentSOS,
    isDeviated,
    isStopped,
    stealthDisguise,
    setStealthDisguise
  } = useSafety();

  const [stealthSOSHover, setStealthSOSHover] = useState(false);

  const isDuress = sosState === 'duress';
  const isSosActive = (sosState === 'queued' || sosState === 'transmitting' || sosState === 'sent' || sosState === 'acknowledged') && !isDuress;

  // Discreet SOS trigger from the ride dashboard
  const handleQuickSilentSOS = () => {
    soundEffects.playTactileClick();
    activateSilentSOS('dashboard_discreet_button');
    navigate('/silent-sos');
  };

  // Stealth Disguise Screen (if activated by user)
  if (stealthDisguise === 'calculator') {
    return (
      <div className="flex-1 flex flex-col justify-between p-4 bg-black text-white select-none">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
          <span>Calculator</span>
          <button
            onClick={() => setStealthDisguise('none')}
            className="text-[10px] text-cyan-400 underline"
          >
            Exit Disguise
          </button>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl text-right text-3xl font-mono text-slate-200">
          0
        </div>
        <div className="grid grid-cols-4 gap-2 my-auto">
          {['C', '+/-', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((k, i) => (
            <button
              key={i}
              className={`p-4 rounded-xl text-lg font-semibold ${
                ['÷', '×', '-', '+', '='].includes(k) ? 'bg-amber-600' : 'bg-slate-800'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 text-center">
          Discreet disguise active. Silent safety tracking continues in background.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 overflow-y-auto select-none">
      {/* Top Ride Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-midnight-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isDeviated ? 'bg-rose-400' : isStopped ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isDeviated ? 'bg-rose-500' : isStopped ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {isDeviated
              ? 'Unscheduled Route Deviation'
              : isStopped
              ? 'Vehicle Stationary (3 min)'
              : 'Trip On Track · Night Owl Active'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>ETA {ride.metrics.timeRemainingMin} mins</span>
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="w-full h-64 sm:h-72 min-h-[240px]">
        <MapComponent height="100%" interactive={true} />
      </div>

      {/* Driver & Vehicle Information Card */}
      <div className="p-3.5 rounded-2xl bg-midnight-900 border border-slate-800/90 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={ride.driver.photo}
              alt={ride.driver.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">{ride.driver.name}</h3>
                <span className="flex items-center text-[11px] font-semibold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                  {ride.driver.rating}
                </span>
              </div>
              <p className="text-xs text-slate-400">{ride.driver.trips.toLocaleString()} trips · Top Rated Partner</p>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-mono text-xs font-bold tracking-wider">
              {ride.driver.plate}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">{ride.driver.vehicle}</p>
          </div>
        </div>

        {/* Location snippet */}
        <div className="space-y-1.5 border-t border-slate-800/70 pt-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span className="truncate">Near: <strong className="text-slate-200">{ride.currentLocationName}</strong></span>
          </div>
        </div>
      </div>

      {/* Emergency & Safety Action Row */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Safety Centre Button */}
        <button
          onClick={() => {
            soundEffects.playTactileClick();
            navigate('/safety-centre');
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-midnight-900 to-midnight-850 hover:from-slate-850 hover:to-slate-800 border border-cyan-800/40 text-slate-100 flex flex-col justify-between transition-all active:scale-95 group shadow-md"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <Shield className="w-4 h-4" />
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-white block">Safety Centre</span>
            <span className="text-[10px] text-slate-400">Live share, 112 & tools</span>
          </div>
        </button>

        {/* Prominent but Discreet Silent SOS Trigger */}
        <button
          onClick={handleQuickSilentSOS}
          onMouseEnter={() => setStealthSOSHover(true)}
          onMouseLeave={() => setStealthSOSHover(false)}
          className={`p-3.5 rounded-2xl border text-slate-100 flex flex-col justify-between transition-all active:scale-95 shadow-md ${
            isSosActive
              ? 'bg-rose-950/80 border-rose-500/80 text-rose-200 animate-pulse'
              : 'bg-gradient-to-br from-rose-950/40 to-midnight-900 hover:from-rose-950/70 border-rose-800/40'
          }`}
          title="Silent SOS: Discreetly transmits coordinates to 24/7 Safety Command Center"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className={`p-2 rounded-xl ${
              isSosActive ? 'bg-rose-600 text-white' : 'bg-rose-950/70 text-rose-400 border border-rose-800/50'
            }`}>
              <Radio className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
              Discreet
            </span>
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-rose-200 block">
              {isSosActive ? 'SOS Dispatched' : 'Silent SOS'}
            </span>
            <span className="text-[10px] text-slate-400">Zero alarm sound</span>
          </div>
        </button>
      </div>

      {/* Discreet stealth camouflage helper */}
      <div className="p-2.5 rounded-xl bg-midnight-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <EyeOff className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px]">Passenger Stealth Disguise:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStealthDisguise('calculator')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
          >
            <Calculator className="w-3 h-3" />
            <span>Calc</span>
          </button>
          <button
            onClick={() => navigate('/triggers')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] transition-colors"
          >
            Pocket Trigger
          </button>
        </div>
      </div>
    </div>
  );
}
