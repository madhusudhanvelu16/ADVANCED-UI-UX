// Mock Data for SafeRide — Night-Time Passenger Safety Interface
export const STUDENT_INFO = {
  name: "V MADHUSUDHAN",
  regNo: "1EP24CS163",
  domain: "Mobility & Intelligent Transport Systems",
  topic: "Night-Time Ride-Hailing Safety Interface",
  focus: "Discreet SOS triggers, false alarms, and duress handling",
  institution: "College Project Presentation"
};

// Route Coordinates in Bengaluru (Koramangala to Indiranagar late night route)
export const INITIAL_ROUTE = {
  pickup: {
    name: "Koramangala 5th Block, 80 Feet Road",
    lat: 12.9352,
    lng: 77.6245,
    time: "11:32 PM"
  },
  destination: {
    name: "Indiranagar 100 Feet Road, 12th Main",
    lat: 12.9719,
    lng: 77.6412,
    time: "11:58 PM (Expected)"
  },
  // Normal scheduled route points
  normalPath: [
    [12.9352, 77.6245], // Pickup
    [12.9410, 77.6268],
    [12.9485, 77.6300], // Sony World Jn
    [12.9550, 77.6322], // Domlur Inner Ring Rd
    [12.9610, 77.6355], // EGL Tech Park flyover
    [12.9665, 77.6385], // Domlur Flyover
    [12.9719, 77.6412]  // Indiranagar 100ft Rd
  ],
  // Route deviation points simulating detour into dark unpaved bypass
  deviatedPath: [
    [12.9352, 77.6245],
    [12.9410, 77.6268],
    [12.9485, 77.6300],
    [12.9512, 77.6180], // Detour west toward abandoned industrial track
    [12.9540, 77.6110], // Unlit perimeter lane
    [12.9568, 77.6045]  // Remote isolated stop point
  ]
};

export const INITIAL_RIDE_STATE = {
  id: "SR-BLR-8942",
  status: "in_progress", // 'in_progress', 'deviated', 'stopped', 'completed'
  driver: {
    name: "Rajesh Kumar",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 4.89,
    trips: 4210,
    vehicle: "Toyota Innova Crysta",
    plate: "KA 03 MG 4821",
    color: "Midnight Silver",
    verifiedBadge: true
  },
  passenger: {
    name: "Aditi Rao",
    phone: "+91 98765 43210"
  },
  metrics: {
    distanceRemainingKm: 3.4,
    timeRemainingMin: 11,
    currentSpeedKmh: 38,
    batteryPercent: 78,
    gpsAccuracyMeters: 3.2,
    ambientLight: "Low (Night Mode Active)"
  },
  currentLocationName: "Near EGL Tech Park Flyover, Inner Ring Road",
  currentCoord: [12.9550, 77.6322]
};

export const INITIAL_CONTACTS = [
  {
    id: "c1",
    name: "Dr. Ananya (Sister)",
    phone: "+91 94481 23456",
    relation: "Family",
    priority: 1,
    autoShareNight: true,
    notifyOnSOS: true
  },
  {
    id: "c2",
    name: "Vikram (Father)",
    phone: "+91 98450 98765",
    relation: "Family",
    priority: 2,
    autoShareNight: true,
    notifyOnSOS: true
  },
  {
    id: "c3",
    name: "Pooja (Flatmate)",
    phone: "+91 97412 55678",
    relation: "Friend",
    priority: 3,
    autoShareNight: false,
    notifyOnSOS: true
  }
];

export const INITIAL_ACTIVITY_LOG = [
  {
    id: "log-1",
    timestamp: "11:30 PM",
    event: "Ride Booked",
    detail: "SafeRide Night Owl Shield auto-enabled",
    type: "info"
  },
  {
    id: "log-2",
    timestamp: "11:32 PM",
    event: "Trip Started",
    detail: "Live telemetry streaming to secure cloud gateway",
    type: "info"
  },
  {
    id: "log-3",
    timestamp: "11:33 PM",
    event: "Live Location Shared",
    detail: "Encrypted tracking link sent to 2 trusted contacts",
    type: "safe"
  }
];

export const UNSAFE_DRIVING_REASONS = [
  { id: "route_change", label: "Unprompted Route Deviation", desc: "Driver diverted from GPS route without asking" },
  { id: "speeding", label: "Rash Driving / Overspeeding", desc: "Erratic lane changes, ignoring traffic lights" },
  { id: "unplanned_stop", label: "Suspicious Unscheduled Stop", desc: "Vehicle halted in unlit or deserted area" },
  { id: "passenger_duress", label: "Driver Behavior / Inappropriate Remarks", desc: "Uncomfortable conversation or refusing to open window/door" },
  { id: "phone_distraction", label: "Continuous Phone Use While Driving", desc: "Watching video or texting behind the wheel" }
];
