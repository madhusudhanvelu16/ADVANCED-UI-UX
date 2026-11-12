# SafeRide — Night-Time Passenger Safety Interface

**Domain:** Mobility & Intelligent Transport Systems  
**Topic:** Night-Time Ride-Hailing Safety Interface  
**Main Focus:** Discreet SOS triggers, false alarms, and duress handling  

---

### Academic Information
- **Student Name:** V MADHUSUDHAN
- **Register Number:** 1EP24CS163
- **Project Type:** College UI/UX Mobility Design Project Presentation

---

## 1. Executive Summary & Objective

In night-time ride-hailing commutes, solo passengers (especially women, elderly individuals, or students travelling late) face extreme vulnerability. If an emergency arises, conventional panic buttons that sound an audible siren or display flashing red screens put the passenger in immediate danger by escalating the driver's aggression.

**SafeRide** solves this dilemma through a multi-tiered covert safety interface:
1. **Discreet SOS Triggers:** Pocket hardware buttons, rapid secret gestures (triple-tap logo, screen taps) and a 1.5-second hold threshold that activate silent telemetry without lighting up the phone or making a sound.
2. **Dual-PIN Architecture (False Alarm vs. Duress):**
   - **Normal Safety PIN (`1234`):** Used when the passenger triggers SOS accidentally. Updates state to *False Alarm Review* and initiates a silent operator verification call/chat without blindly cancelling police dispatch.
   - **Duress Safety PIN (`9999`):** Entered when the driver coerces or forces the passenger to unlock the phone and cancel the alert. The screen immediately displays a completely peaceful, calm ride view (*"Alert Cancelled — Have a Safe Journey"*), but internally escalates to **CRITICAL DURESS** with continuous high-rate GPS & silent audio streaming to 24/7 Safety Command Centers.
3. **Autonomous AI Safety Shield:** Proactively detects unscheduled stationary stops (>3 min in unlit sectors) and route diversions (>400m from corridor), prompting the passenger with an automatic 30s countdown before self-dispatching Silent SOS.
4. **Evaluator Demo Lab & Inspector:** A built-in floating command dock allowing college evaluators and professors to inspect internal state, test hardware triggers, simulate route detours, and observe the covert duress mechanism.

---

## 2. Technology Stack

- **Core Framework:** React 18 with Vite
- **Styling & Design System:** Tailwind CSS (Modern Dark Cinema Mobile palette: midnight-950, deep navy slate, emergency rose, safe emerald)
- **Map & Geospatial Visualization:** Leaflet with CartoDB Dark Matter tiles and OpenStreetMap
- **Icons & Visual Language:** Lucide React
- **Audio & Haptic Simulation:** Web Audio API synth (low-frequency inaudible tactile bump & stealth verification pings) + `navigator.vibrate`
- **Routing:** React Router (HashRouter for zero-config static hosting & presentation compatibility)

---

## 2.1 Specialized Night & Dark Theme Ergonomics

To protect passengers riding in dark vehicles, SafeRide provides 4 specialized night and dark themes that reduce ambient luminescence and prevent the passenger's face from lighting up in the rear-view mirror:

1. **Midnight Navy (Standard Night Dark):** Deep indigo & slate navy background (`#060913`). Balanced contrast for night mobility.
2. **OLED Pitch Black (Stealth Zero-Glow):** Pure 100% black (`#000000`). Turns off black OLED pixels completely, preventing any light reflection from reaching the driver's eyes.
3. **Tactical Red (Scotopic Night Vision):** Low-frequency red/crimson spectrum inspired by aviation & covert defense. Preserves the passenger's dark-adapted rod vision and keeps alert activity inconspicuous in total darkness.
4. **Cyber Neon (High Contrast Vector):** Deep sapphire with electric cyan road vectors for crystal-clear readability under dim street lighting.

Switch themes instantly from:
- The **Moon Icon** in the top navigation bar
- The **Theme Selector Pills** in the top presentation header
- **Safety Settings (Screen 10)** under *Cab Stealth Ergonomics*

---

## 3. The 10 Specialized Screens

| # | Screen | Key Functionality |
|---|---|---|
| **1** | **Welcome Screen** | SafeRide logo, academic badge (V MADHUSUDHAN, 1EP24CS163), "Your Safety, Our Priority", core innovation highlights, and "Start Sample Night Ride" CTA. |
| **2** | **Active Ride Dashboard** | Interactive night map, live moving vehicle marker, driver details (Rajesh Kumar, 4.89★, KA 03 MG 4821), ETA, status HUD, Safety Centre button, discreet SOS trigger, and calculator stealth camouflage. |
| **3** | **Safety Centre** | 5 core emergency actions: 1.5-second hold SOS with animated SVG radial progress ring, 256-bit live location sharing, trusted person contact, national 112 emergency bridge, and unsafe driving reporting modal. |
| **4** | **Silent SOS** | Real-time transmission pipeline (Queued → Transmitting → Sent → Acknowledged by Dispatcher), live GPS telemetry stream, zero-siren stealth design, discreet return to ride, and calculator camouflage. |
| **5** | **Discreet Emergency Triggers** | Interactive 1.5s long-press test, configurable secret gesture (triple-tap logo, quad-tap map, double shake), and hardware volume-button simulator (shortcut 'V' or on-screen rocker). |
| **6** | **False Alarm Management** | 4-digit PIN pad. Entering Normal PIN (`1234`) sets alert to "False Alarm Review" and logs accidental notification without blindly dropping response units. |
| **7** | **Duress Mode (Hostage Protocol)** | Entering Duress PIN (`9999`) shows a calm, peaceful ride dashboard to deceive an attacker, while internally triggering high-priority police dispatch. Includes split-view Evaluator Inspector. |
| **8** | **Trusted Contacts** | Add/remove emergency contacts, toggle automatic night sharing (9 PM – 6 AM), simulate emergency SMS/WhatsApp broadcast, and audit log history. |
| **9** | **Ride Monitoring (AI Shield)** | Route telemetry, simulated detour into unlit bypass, simulated unscheduled stop, and autonomous assistance prompt with 30s countdown before auto-SOS. |
| **10** | **Safety Settings** | Change normal PIN & duress PIN with collision check, customize hold threshold, toggle hardware triggers, automated checks, and privacy & simulated emergency disclaimer. |

---

## 4. Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher recommended; verified on Node v26.0.0)
- npm (v9.0.0 or higher)

### Installation Steps

1. Clone or navigate to the project directory:
   ```bash
   cd "e:\SOS and safety features"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Production Build
To create an optimized production bundle:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready for deployment on Netlify, Vercel, or GitHub Pages.

---

## 5. College Presentation Demonstration Script (Step-by-Step)

Follow this 5-minute walkthrough during your project review or viva:

1. **Introduction (Screen 1):**
   - Point out your name (**V MADHUSUDHAN**) and register number (**1EP24CS163**) on the header.
   - Explain the core motivation: night-time ride safety requires **discreetness**, because loud sirens put passengers in direct danger of retaliation.
   - Click **"Start Sample Night Ride"**.

2. **Active Ride & Route Map (Screen 2):**
   - Demonstrate the Leaflet night-mode map showing the car moving along Koramangala to Indiranagar late-night corridor.
   - Show the driver card (Rajesh Kumar, Toyota Innova Crysta, KA 03 MG 4821).
   - Point to the top right toggle: switch between **Mobile Phone Frame** (realistic iPhone mockup) and **Wide View**.

3. **Discreet SOS & 1.5s Hold (Screen 3 & Screen 4):**
   - Open **Safety Centre** (`/safety-centre`).
   - Press and hold the **Silent SOS** button: demonstrate the radial progress ring filling for 1.5s.
   - Upon completion, observe Screen 4: **no loud sirens play**. The transmission pipeline progresses from *Queued* to *Sent* to *Acknowledged by Command Officer Rajeshwari*.
   - Click **"Camouflage Calc"** to demonstrate how a passenger can disguise their phone as a working calculator if the driver looks back.

4. **False Alarm vs. Duress PIN Defense (Screen 6 & Screen 7) — KEY EVALUATION FOCUS:**
   - Click **"Enter Security PIN"** or open the **Demo Lab** (bottom right).
   - **Case A: False Alarm (Normal PIN `1234`):**
     - Type `1234`. The system displays "False Alarm Recorded". Emphasize to the examiner that real safety protocols *never* cancel emergency response blindly without operator verification callback.
   - **Case B: Duress Mode (Hostage PIN `9999`):**
     - Trigger Silent SOS again, then enter `9999`.
     - Notice that the passenger's screen immediately shows a calm, normal, peaceful ride screen (*"Trip In Progress · SafeRide Active"*), so if the driver grabs or inspects the phone, they believe the alert was deactivated.
     - Open the **Demo Lab** dock to reveal to the examiner: **CRITICAL DURESS (COVERT DISPATCH) ACTIVE** with continuous high-rate location streaming!

5. **AI Safety Shield & Route Detour (Screen 9):**
   - Navigate to **Monitoring** (`/monitoring`).
   - Click **"Simulate Detour"**: the vehicle marker diverges off the highway into an unlit perimeter lane.
   - An autonomous dialog pops up: *"Route Deviation Detected. Tap within 25s or Silent SOS activates automatically."*

6. **Safety & Privacy Compliance (Screen 10):**
   - Review Indian National Emergency number (**112**) integration disclaimer.
   - Explain the zero-eavesdropping policy and encrypted telemetry packaging.

---

## 6. Safety & Ethical Disclaimers

- **Academic Simulation:** All emergency dispatches, dispatcher identities, and audio streams in this web application are local simulated models designed for academic UI/UX demonstration.
- **No Real Dispatch:** No actual telephone calls to 112 or police units are triggered by this software.
- **Privacy:** No personal data, camera feeds, or microphone recordings are harvested or transmitted.

---

© 2026 SafeRide Project · Mobility Domain · V MADHUSUDHAN (1EP24CS163)
