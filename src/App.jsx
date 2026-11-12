import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SafetyProvider } from './context/SafetyContext';
import DeviceWrapper from './components/DeviceWrapper';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import DevDock from './components/DevDock';

// 10 Screens
import Screen1Welcome from './screens/Screen1Welcome';
import Screen2ActiveRide from './screens/Screen2ActiveRide';
import Screen3SafetyCentre from './screens/Screen3SafetyCentre';
import Screen4SilentSOS from './screens/Screen4SilentSOS';
import Screen5DiscreetTriggers from './screens/Screen5DiscreetTriggers';
import Screen6FalseAlarm from './screens/Screen6FalseAlarm';
import Screen7DuressMode from './screens/Screen7DuressMode';
import Screen8TrustedContacts from './screens/Screen8TrustedContacts';
import Screen9RideMonitoring from './screens/Screen9RideMonitoring';
import Screen10SafetySettings from './screens/Screen10SafetySettings';

function AppLayout() {
  const location = useLocation();
  const isWelcome = location.pathname === '/' || location.pathname === '/welcome';

  return (
    <DeviceWrapper>
      <Navbar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Screen1Welcome />} />
          <Route path="/welcome" element={<Screen1Welcome />} />
          <Route path="/ride" element={<Screen2ActiveRide />} />
          <Route path="/safety-centre" element={<Screen3SafetyCentre />} />
          <Route path="/silent-sos" element={<Screen4SilentSOS />} />
          <Route path="/triggers" element={<Screen5DiscreetTriggers />} />
          <Route path="/false-alarm" element={<Screen6FalseAlarm />} />
          <Route path="/duress-mode" element={<Screen7DuressMode />} />
          <Route path="/contacts" element={<Screen8TrustedContacts />} />
          <Route path="/monitoring" element={<Screen9RideMonitoring />} />
          <Route path="/settings" element={<Screen10SafetySettings />} />
        </Routes>
      </div>
      {!isWelcome && <BottomNav />}
      <DevDock />
    </DeviceWrapper>
  );
}

export default function App() {
  // Using HashRouter for robust routing without backend 404 rewrite requirements
  return (
    <SafetyProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </SafetyProvider>
  );
}
