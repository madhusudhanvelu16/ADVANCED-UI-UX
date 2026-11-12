import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Car, Radio, Users, Settings, AlertOctagon } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { soundEffects } from '../utils/soundEffects';

export default function BottomNav() {
  const { sosState } = useSafety();
  const isDuress = sosState === 'duress';
  const isSosActive = (sosState === 'queued' || sosState === 'transmitting' || sosState === 'sent' || sosState === 'acknowledged') && !isDuress;

  const handleNavClick = () => {
    soundEffects.playTactileClick();
  };

  const navItems = [
    { to: '/ride', label: 'Ride', icon: Car },
    { to: '/safety-centre', label: 'Safety Hub', icon: Shield, badge: isSosActive ? 'SOS' : null },
    { to: '/triggers', label: 'Triggers', icon: Radio },
    { to: '/contacts', label: 'Contacts', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 z-40 w-full bg-midnight-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200
              ${isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-rose-500 text-[9px] text-white font-extrabold rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
