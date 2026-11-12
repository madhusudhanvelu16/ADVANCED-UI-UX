import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  STUDENT_INFO,
  INITIAL_ROUTE,
  INITIAL_RIDE_STATE,
  INITIAL_CONTACTS,
  INITIAL_ACTIVITY_LOG
} from '../data/mockRideData';
import { soundEffects } from '../utils/soundEffects';

export const NIGHT_THEMES = [
  {
    id: 'midnight',
    name: 'Midnight Navy',
    subtitle: 'Classic Night Dark',
    desc: 'Deep indigo & slate navy. Balanced contrast for night mobility.',
    bg: '#060913',
    card: '#0b1120',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    badge: 'Standard'
  },
  {
    id: 'oled',
    name: 'OLED Pitch Black',
    subtitle: 'Zero Ambient Reflection',
    desc: 'Pure 100% black. Prevents lighting up passenger face in dark back seat.',
    bg: '#000000',
    card: '#080808',
    accent: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.4)',
    badge: 'Stealth'
  },
  {
    id: 'tactical-red',
    name: 'Tactical Red',
    subtitle: 'Scotopic Night Vision',
    desc: 'Low-frequency red spectrum. Preserves dark-adapted rod vision.',
    bg: '#070203',
    card: '#140407',
    accent: '#fb7185',
    glow: 'rgba(244, 63, 94, 0.5)',
    badge: 'Covert'
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    subtitle: 'High Contrast Vector',
    desc: 'Deep sapphire with glowing electric cyan roads for maximum visibility.',
    bg: '#020617',
    card: '#070f23',
    accent: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.5)',
    badge: 'High Contrast'
  }
];

const SafetyContext = createContext();

export function SafetyProvider({ children }) {
  // Student & Project Info
  const student = STUDENT_INFO;

  // Viewport mode: 'mobile_frame' (iPhone/Android mock frame) or 'responsive' (full-width)
  const [deviceFrameMode, setDeviceFrameMode] = useState('mobile_frame');

  // Night & Dark Themes: 'midnight' | 'oled' | 'tactical-red' | 'cyber-neon'
  const [appTheme, setAppTheme] = useState(() => {
    return localStorage.getItem('saferide_night_theme') || 'midnight';
  });

  const changeTheme = (themeId) => {
    soundEffects.playTactileClick();
    setAppTheme(themeId);
    localStorage.setItem('saferide_night_theme', themeId);
    addLog("Theme Switched", `Active theme changed to ${themeId.toUpperCase()}`, "info");
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-midnight', 'theme-oled', 'theme-tactical-red', 'theme-cyber-neon');
    root.classList.add(`theme-${appTheme}`);
  }, [appTheme]);

  // Active Ride Info
  const [ride, setRide] = useState(INITIAL_RIDE_STATE);
  const [routePath, setRoutePath] = useState(INITIAL_ROUTE.normalPath);
  const [currentCoordIndex, setCurrentCoordIndex] = useState(3);
  const [isDeviated, setIsDeviated] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  // Security PINs
  const [normalPin, setNormalPin] = useState("1234");
  const [duressPin, setDuressPin] = useState("9999");

  // Alert State: 'idle' | 'queued' | 'transmitting' | 'sent' | 'acknowledged' | 'duress' | 'false_alarm_review'
  const [sosState, setSosState] = useState('idle');
  const [alertTimestamp, setAlertTimestamp] = useState(null);
  const [alertTelemetry, setAlertTelemetry] = useState(null);
  const [dispatcherName, setDispatcherName] = useState(null);

  // Discreet Triggers Config
  const [triggerGesture, setTriggerGesture] = useState('triple_tap_logo'); // 'triple_tap_logo', 'quad_tap_map', 'triple_volume'
  const [holdDurationSec, setHoldDurationSec] = useState(1.5);
  const [volumeTriggerEnabled, setVolumeTriggerEnabled] = useState(true);
  const [autoSafetyChecks, setAutoSafetyChecks] = useState(true);

  // Stealth disguise mode: 'none' | 'calculator' | 'music' | 'notes'
  const [stealthDisguise, setStealthDisguise] = useState('none');

  // AI Prompt Modal (Unexpected stop or deviation)
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiPromptDetails, setAiPromptDetails] = useState({
    title: "",
    message: "",
    secondsLeft: 30
  });

  // Contacts & History
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOG);

  // Developer Panel Open state
  const [devPanelOpen, setDevPanelOpen] = useState(false);

  // Helper to add activity log
  const addLog = (event, detail, type = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      event,
      detail,
      type
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Audio effect toggle
  const [audioFeedback, setAudioFeedback] = useState(true);
  const toggleAudio = () => {
    const nextVal = !audioFeedback;
    setAudioFeedback(nextVal);
    soundEffects.toggleSound(nextVal);
  };

  // Trigger Silent SOS Alert
  const activateSilentSOS = (source = 'discreet_trigger') => {
    soundEffects.playTactileClick();
    const now = new Date().toLocaleTimeString();
    setAlertTimestamp(now);

    const telemetry = {
      alertId: `SOS-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: now,
      triggerSource: source,
      lat: ride.currentCoord[0],
      lng: ride.currentCoord[1],
      accuracy: "3.2m",
      speed: `${ride.metrics.currentSpeedKmh} km/h`,
      battery: `${ride.metrics.batteryPercent}%`,
      vehicle: `${ride.driver.vehicle} (${ride.driver.plate})`,
      driver: ride.driver.name,
      silentAudioStream: "Active (256kbps encrypted telemetry packet)",
      emergencyTeamStatus: "Queued at Bengaluru 24/7 Safety Command Center"
    };

    setAlertTelemetry(telemetry);
    setSosState('queued');
    addLog("Silent SOS Triggered", `Triggered via [${source}]. Silent packet buffering.`, "danger");

    // Realistic state progression: Queued -> Transmitting (1s) -> Sent (2.5s) -> Acknowledged (5s)
    setTimeout(() => {
      setSosState(prev => (prev === 'queued' ? 'transmitting' : prev));
      addLog("SOS Telemetry Transmitted", "Encrypted 256-bit emergency handshake sent to response cloud.", "warning");
    }, 1200);

    setTimeout(() => {
      setSosState(prev => (prev === 'transmitting' ? 'sent' : prev));
      addLog("Alert Sent to Safety Dispatch", "Coordinates & ride telematics locked. Notifying trusted contacts.", "danger");
    }, 2800);

    setTimeout(() => {
      setSosState(prev => {
        if (prev === 'sent') {
          setDispatcherName("Command Officer Rajeshwari N. (Badge #BLR-409)");
          return 'acknowledged';
        }
        return prev;
      });
      addLog("Dispatcher Acknowledged", "Command Officer Rajeshwari assigned. Silent audio verification active.", "danger");
    }, 5500);
  };

  // PIN verification logic: handles normal PIN vs duress PIN
  const handlePinSubmit = (enteredPin) => {
    soundEffects.playTactileClick();
    if (enteredPin === duressPin) {
      // DURESS MODE ACTIVATED!
      // The passenger screen MUST look completely normal and calm!
      // BUT internally, the emergency alert is escalated to critical duress!
      setSosState('duress');
      setStealthDisguise('none');
      setAiPromptOpen(false);

      addLog(
        "CRITICAL DURESS PIN ENTERED (9999)",
        "Passenger forced to cancel. Passenger screen disguised as normal. High-priority silent police dispatch notified!",
        "duress"
      );
      soundEffects.playStealthConfirmed();
      return {
        success: true,
        mode: 'duress',
        message: "Trip monitoring normal." // Discreet reassuring message to driver looking at phone
      };
    } else if (enteredPin === normalPin) {
      // Normal PIN entered: False alarm management
      // We do NOT assume immediate total emergency cancel; we flag as false alarm review
      setSosState('false_alarm_review');
      setStealthDisguise('none');
      setAiPromptOpen(false);

      addLog(
        "Normal PIN Entered (1234)",
        "False alarm recorded. Dispatcher alerted of accidental trigger. Standard protocol holds verification callback.",
        "safe"
      );
      soundEffects.playStealthConfirmed();
      return {
        success: true,
        mode: 'normal',
        message: "Safety alert cancelled. Operator silent review initiated."
      };
    } else {
      soundEffects.playTactileClick();
      return {
        success: false,
        mode: 'invalid',
        message: "Incorrect security PIN. Please try again."
      };
    }
  };

  // Simulate Route Deviation
  const simulateRouteDeviation = () => {
    soundEffects.playPromptPing();
    setIsDeviated(true);
    setRoutePath(INITIAL_ROUTE.deviatedPath);
    setRide(prev => ({
      ...prev,
      status: "deviated",
      currentLocationName: "Dark By-Lane, Off Inner Ring Road (Unplanned Route)",
      currentCoord: INITIAL_ROUTE.deviatedPath[3],
      metrics: {
        ...prev.metrics,
        currentSpeedKmh: 42
      }
    }));
    addLog("Route Deviation Detected", "Vehicle diverged by 450m from designated route into unlit corridor.", "warning");

    if (autoSafetyChecks) {
      setAiPromptDetails({
        title: "Route Deviation Detected",
        message: "Your vehicle has taken an unverified route off the main corridor. Is everything okay?",
        secondsLeft: 25
      });
      setAiPromptOpen(true);
    }
  };

  // Simulate Unexpected Stop
  const simulateUnscheduledStop = () => {
    soundEffects.playPromptPing();
    setIsStopped(true);
    setRide(prev => ({
      ...prev,
      status: "stopped",
      metrics: {
        ...prev.metrics,
        currentSpeedKmh: 0
      }
    }));
    addLog("Unscheduled Stop Detected", "Vehicle has remained stationary for 3+ minutes in a low-visibility sector.", "warning");

    if (autoSafetyChecks) {
      setAiPromptDetails({
        title: "Unscheduled Stop Detected",
        message: "Your ride has been stationary for over 3 minutes in an unmapped stop area. Please confirm your status.",
        secondsLeft: 20
      });
      setAiPromptOpen(true);
    }
  };

  // Simulate Dispatcher Acknowledgment manually
  const simulateDispatcherAck = () => {
    setDispatcherName("Command Officer Rajeshwari N. (Badge #BLR-409)");
    setSosState('acknowledged');
    addLog("Emergency Acknowledged", "Dispatcher assigned. Live audio & GPS telemetry streaming active.", "danger");
  };

  // Reset Application to Initial Sample State
  const resetRide = () => {
    setRide(INITIAL_RIDE_STATE);
    setRoutePath(INITIAL_ROUTE.normalPath);
    setCurrentCoordIndex(3);
    setIsDeviated(false);
    setIsStopped(false);
    setSosState('idle');
    setAlertTimestamp(null);
    setAlertTelemetry(null);
    setDispatcherName(null);
    setStealthDisguise('none');
    setAiPromptOpen(false);
    addLog("System Reset", "SafeRide initialized to sample night-time commute.", "info");
  };

  // AI Prompt countdown timer effect
  useEffect(() => {
    let timer = null;
    if (aiPromptOpen && aiPromptDetails.secondsLeft > 0) {
      timer = setInterval(() => {
        setAiPromptDetails(prev => {
          if (prev.secondsLeft <= 1) {
            clearInterval(timer);
            // Automatic trigger when countdown expires
            activateSilentSOS("ai_safety_shield_timeout");
            return { ...prev, secondsLeft: 0 };
          }
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [aiPromptOpen, aiPromptDetails.secondsLeft]);

  // Vehicle slow motion along path simulation
  useEffect(() => {
    const moveTimer = setInterval(() => {
      if (ride.status !== 'stopped') {
        setCurrentCoordIndex(prev => {
          const nextIdx = (prev + 1) % routePath.length;
          setRide(r => ({
            ...r,
            currentCoord: routePath[nextIdx],
            metrics: {
              ...r.metrics,
              distanceRemainingKm: Math.max(0.4, (r.metrics.distanceRemainingKm - 0.2).toFixed(1)),
              timeRemainingMin: Math.max(2, r.metrics.timeRemainingMin - 1)
            }
          }));
          return nextIdx;
        });
      }
    }, 7000);
    return () => clearInterval(moveTimer);
  }, [routePath, ride.status]);

  // Contact actions
  const addContact = (contact) => {
    setContacts(prev => [...prev, { ...contact, id: `c-${Date.now()}` }]);
    addLog("Contact Added", `${contact.name} added to emergency notification list`, "safe");
  };

  const removeContact = (id) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    if (contact) {
      addLog("Contact Removed", `${contact.name} removed from emergency circle`, "info");
    }
  };

  const toggleAutoShare = (id) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, autoShareNight: !c.autoShareNight } : c));
  };

  // Value export
  const value = {
    student,
    deviceFrameMode,
    setDeviceFrameMode,
    appTheme,
    changeTheme,
    NIGHT_THEMES,
    ride,
    setRide,
    routePath,
    isDeviated,
    isStopped,
    normalPin,
    setNormalPin,
    duressPin,
    setDuressPin,
    sosState,
    setSosState,
    alertTimestamp,
    alertTelemetry,
    dispatcherName,
    triggerGesture,
    setTriggerGesture,
    holdDurationSec,
    setHoldDurationSec,
    volumeTriggerEnabled,
    setVolumeTriggerEnabled,
    autoSafetyChecks,
    setAutoSafetyChecks,
    stealthDisguise,
    setStealthDisguise,
    aiPromptOpen,
    setAiPromptOpen,
    aiPromptDetails,
    contacts,
    activityLogs,
    devPanelOpen,
    setDevPanelOpen,
    audioFeedback,
    toggleAudio,
    activateSilentSOS,
    handlePinSubmit,
    simulateRouteDeviation,
    simulateUnscheduledStop,
    simulateDispatcherAck,
    resetRide,
    addContact,
    removeContact,
    toggleAutoShare,
    addLog
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
}

export const useSafety = () => useContext(SafetyContext);
