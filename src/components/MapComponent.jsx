import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useSafety } from '../context/SafetyContext';
import { Navigation, Layers, Plus, Minus, Compass } from 'lucide-react';

const TILE_PRESETS = {
  dark: {
    name: 'Night Vision',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap'
    },
    className: 'map-theme-dark'
  },
  streets: {
    name: 'Street View',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap'
    },
    className: 'map-theme-streets'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 18,
      attribution: '&copy; Esri'
    },
    className: 'map-theme-satellite'
  }
};

export default function MapComponent({ height = "100%", interactive = true }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);

  const [currentTheme, setCurrentTheme] = useState('dark'); // 'dark' | 'streets' | 'satellite'
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);

  const { ride, routePath, isDeviated, isStopped, appTheme } = useSafety();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: ride.currentCoord,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive
      });

      // Free OpenStreetMap tile layer (No API Key Required)
      const initialPreset = TILE_PRESETS[currentTheme];
      tileLayerRef.current = L.tileLayer(initialPreset.url, initialPreset.options).addTo(map);

      // Pickup Marker icon (A)
      const pickupIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-7 h-7 bg-emerald-500/30 rounded-full animate-ping"></div>
            <div class="w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-[10px] font-bold text-white">
              A
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      // Destination Marker icon (B)
      const destIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-5 h-5 bg-rose-500 border-2 border-white rounded-md shadow-lg flex items-center justify-center text-[10px] font-bold text-white">
              B
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      // Vehicle Icon (Moving car with active radar wave)
      const carIcon = L.divIcon({
        className: 'vehicle-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 rounded-full ${isDeviated ? 'bg-rose-500/30' : 'bg-cyan-500/25'} animate-radar"></div>
            <div class="w-8 h-8 ${isDeviated ? 'bg-rose-600' : isStopped ? 'bg-amber-500' : 'bg-blue-600'} border-2 border-slate-950 rounded-full shadow-2xl flex items-center justify-center text-white transition-colors duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });

      // Place pickup and destination markers
      const startPoint = routePath[0];
      const endPoint = routePath[routePath.length - 1];
      L.marker(startPoint, { icon: pickupIcon }).addTo(map);
      L.marker(endPoint, { icon: destIcon }).addTo(map);

      // Create vehicle marker
      vehicleMarkerRef.current = L.marker(ride.currentCoord, { icon: carIcon }).addTo(map);

      // Route polyline
      routePolylineRef.current = L.polyline(routePath, {
        color: '#38bdf8',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map instance persists with React component lifecycle
    };
  }, []);

  // Handle tile theme switches
  const switchTheme = (themeKey) => {
    setCurrentTheme(themeKey);
    setLayersMenuOpen(false);

    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const preset = TILE_PRESETS[themeKey];
      tileLayerRef.current = L.tileLayer(preset.url, preset.options).addTo(mapInstanceRef.current);
    }
  };

  // Update vehicle position and path when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setLatLng(ride.currentCoord);

      // Update vehicle marker icon depending on deviation
      const carIcon = L.divIcon({
        className: 'vehicle-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 rounded-full ${isDeviated ? 'bg-rose-500/30' : 'bg-cyan-500/25'} animate-radar"></div>
            <div class="w-8 h-8 ${isDeviated ? 'bg-rose-600' : isStopped ? 'bg-amber-500' : 'bg-blue-600'} border-2 border-slate-950 rounded-full shadow-2xl flex items-center justify-center text-white transition-colors duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      vehicleMarkerRef.current.setIcon(carIcon);
    }

    if (routePolylineRef.current) {
      const getRouteColor = () => {
        if (isDeviated) return '#f43f5e';
        if (appTheme === 'tactical-red') return '#fb7185';
        if (appTheme === 'cyber-neon') return '#22d3ee';
        if (appTheme === 'oled') return '#60a5fa';
        return '#38bdf8';
      };

      routePolylineRef.current.setLatLngs(routePath);
      routePolylineRef.current.setStyle({
        color: getRouteColor(),
        dashArray: isDeviated ? '8, 8' : null
      });
    }
  }, [ride.currentCoord, routePath, isDeviated, isStopped, appTheme]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(ride.currentCoord, 15, {
        duration: 1.2
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const activeThemeClass = currentTheme === 'dark'
    ? (appTheme === 'oled'
        ? 'map-theme-oled'
        : appTheme === 'tactical-red'
        ? 'map-theme-tactical-red'
        : appTheme === 'cyber-neon'
        ? 'map-theme-cyber-neon'
        : 'map-theme-dark')
    : TILE_PRESETS[currentTheme]?.className || 'map-theme-dark';

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-midnight-950 ${activeThemeClass}`} style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Recenter & Map Overlay Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
        <button
          onClick={handleRecenter}
          title="Recenter on Vehicle"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 rounded-xl border border-slate-700/60 shadow-lg backdrop-blur-md transition-all active:scale-95"
        >
          <Navigation className="w-4 h-4" />
        </button>

        {/* Zoom In & Out */}
        {interactive && (
          <div className="flex flex-col bg-slate-900/90 rounded-xl border border-slate-700/60 overflow-hidden shadow-lg backdrop-blur-md">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 border-b border-slate-700/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Layer style toggle */}
        {interactive && (
          <div className="relative">
            <button
              onClick={() => setLayersMenuOpen(!layersMenuOpen)}
              title="Change Map Style"
              className={`p-2.5 rounded-xl border shadow-lg backdrop-blur-md transition-all active:scale-95 ${
                layersMenuOpen
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700/60'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Layer selection dropdown */}
            {layersMenuOpen && (
              <div className="absolute top-0 right-12 w-32 bg-midnight-950/95 border border-slate-700 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 text-[11px] font-sans">
                {Object.entries(TILE_PRESETS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => switchTheme(key)}
                    className={`px-2 py-1.5 rounded-lg text-left transition-colors flex items-center justify-between ${
                      currentTheme === key
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    {currentTheme === key && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map status HUD badge */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800/80 shadow-md text-xs font-medium">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDeviated ? 'bg-rose-400' : isStopped ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isDeviated ? 'bg-rose-500' : isStopped ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
        </span>
        <span className="text-slate-300">
          {isDeviated ? 'Route Diverged' : isStopped ? 'Vehicle Stationary' : 'GPS Shield Active'}
        </span>
      </div>

      {/* Speed & Accuracy overlay */}
      <div className="absolute bottom-3 left-3 z-[400] px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-[11px] font-mono text-slate-400">
        GPS ±3.2m · {ride.metrics.currentSpeedKmh} km/h · {TILE_PRESETS[currentTheme].name}
      </div>
    </div>
  );
}
