# ApexIntel: AI Motorsport Energy & Overtake Intelligence Platform

> Enterprise-grade full-stack web application designed for Grand Prix pit-wall engineers and motorsport strategists. Visualizes multi-season historical telemetry (GPS traces, driver corner-exit lag, battery State-of-Charge depletion, and braking points) to compute deterministic, multi-lap overtaking corridors and optimal battery deployment strategies for hybrid race cars.

---

## 🏎️ Key Features

### 1. 3D Interactive Hero Scrollytelling Viewport
- **Procedural 3D Race Circuit & Vehicle Mesh**: High-performance Three.js ribbon featuring procedural kerbs, apex turn markers, track limits, and a high-tech 3D F1 car model (carbon chassis, front/rear wings, DRS indicator, halo structure, and ERS energy flow particle field).
- **Computed Trajectory Overlays**:
  - **Glowing Cyan/Green Spline**: AI-computed optimal racing line derived from historical passes.
  - **Red Dashed Spline**: Defending opponent's historical line (early apex, compromised exit).
- **Dynamic 3D HUD Overlay**: Floating telemetry tag anchored directly to the 3D car showing Speed (km/h), Throttle %, Brake %, and Battery State-of-Charge (MJ remaining & %).
- **4 Parallax Scrollytelling Stages**:
  1. **Lap -3 (Telemetry Match)**: Zoomed camera locks on rival driver throttle pickup lag (+28ms on Turn 4 exit) and correlates multi-season Grand Prix baselines.
  2. **Lap -2 (Stealth Harvest)**: Track dims into thermal view as MGU-K harvests energy in slow corners (SoC surges to 95.4% / 3.82 MJ).
  3. **Lap -1 (Pressure Feint)**: Chassis shifts to dummy line, forcing rival into an emergency 1.8 MJ defensive dump and overheating opponent tires.
  4. **Lap 0 (The Strike)**: Low-angle dynamic chase camera. AI vehicle deploys 4.2 MJ burst, carries superior speed around Turn 4 outside-in, and completes the pass.

### 2. Pit-Wall Intelligence Modules & Dashboard
- **Past Race Strategy & Circuit Explorer**: Select historic Grand Prix circuits (Bahrain Sakhir, Silverstone, Spa-Francorchamps) and seasons (2022–2025). Displays an interactive **Sector Pass Matrix** table with pass success %, energy cost (MJ), and rival re-pass risk rating.
- **Opponent Driver Behavioral Profiler**: Visual cards profiling rival driver archetypes (*"Aggressive Inside-Line Blockers"* vs. *"Late-Braking Counter-Attackers"*) alongside **Apex Speed & Throttle Pickup Delta Graphs**.
- **Live Telemetry & Strategy Replay Sandbox**: Step-by-step lap timeline slider (-3 to 0) with live Recharts time-series charts rendering Battery SoC %, Throttle/Brake deltas, and an **Overtake Success Probability Gauge (0–100%)**.
- **Real-Time Overtake Strategy Calculator**: Live form connecting directly to the FastAPI backend `/api/v1/strategy/compute-overtake` endpoint to calculate custom ERS engine modes, waypoint corridors, energy budget, and projected time gains.

---

## 🛠️ Technology Stack Architecture

### Frontend
- **Framework**: Next.js 14 (App Router, TypeScript)
- **3D & Parallax**: Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`
- **Styling**: Tailwind CSS (Dark F1 Telemetry Theme: Obsidian `#0B0E14`, Neon Cyan `#00F5FF`, Electric Acid Green `#39FF14`, Alert Red `#FF3B30`)
- **Charts & Motion**: Recharts, Framer Motion, Lucide-React

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Data Engineering**: Pydantic v2, NumPy, Uvicorn
- **Architecture**: REST API with typed endpoints serving circuit metadata, time-series telemetry, driver profiles, and ML strategy calculations.

---

## 🔌 API Specification

### `GET /api/v1/circuits`
Returns available circuits, sector layouts, and historical passing zones.

### `GET /api/v1/telemetry/historical/{circuit_id}/{driver_id}`
Returns time-series telemetry traces (GPS coordinates, speed, throttle, brake, ERS battery SoC, gear, and tire temperatures).

### `POST /api/v1/strategy/compute-overtake`
Computes optimal multi-lap energy deployment, target passing sector, 3D waypoint coordinates, and pass success probability.

**Sample Request Payload**:
```json
{
  "circuit_id": "sakhir",
  "current_lap": 0,
  "gap_to_car_ahead_sec": 0.65,
  "player_soc_pct": 85.0,
  "opponent_driver_id": "max_ver",
  "target_sector": 1
}
```

**Sample Response**:
```json
{
  "circuit_id": "sakhir",
  "recommended_passing_sector": 1,
  "target_corner": 4,
  "estimated_pass_lap": 0,
  "success_probability_pct": 96.8,
  "energy_budget_mj": 4.12,
  "net_time_gain_sec": 0.58,
  "engine_mode_sequence": [
    "S1: MGU-K Heavy Recharge (Lap -2)",
    "S2: Stealth SoC Staging (Lap -1)",
    "S3 Entry: DRS Flap Open & 4.2 MJ ERS Overtake Burst",
    "Apex Exit: Late Apex Traction Cut & Defensive Lockout"
  ],
  "overtake_corridor_waypoints": [],
  "risk_level": "Calculated",
  "ai_tactical_summary": "AI Reinforcement Learning Policy recommends staging at Turn 4..."
}
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js >= 18.x
- Python >= 3.11
- npm / yarn

### Method 1: Using `start.bat` (Windows)
Double click `start.bat` or run:
```cmd
start.bat
```
This automatically installs dependencies for both backend and frontend, and launches the development servers concurrently.

### Method 2: Manual Setup

#### 1. Start the FastAPI Backend:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*Backend API docs will be available at: http://localhost:8000/docs*

#### 2. Start the Next.js Frontend:
```bash
cd frontend
npm install
npm run dev
```
*Frontend application will be available at: http://localhost:3000*

### Method 3: Using Docker Compose
```bash
docker-compose up --build
```

---

## 🚀 Directory Structure
```
Track SHIFT Moto Sport /
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI entry point & CORS
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── mock_data.py        # Telemetry & driver datasets
│   │   └── routers/
│   │       ├── circuits.py     # GET /api/v1/circuits
│   │       ├── telemetry.py    # GET /api/v1/telemetry
│   │       ├── strategy.py     # POST /api/v1/strategy/compute-overtake
│   │       └── drivers.py      # GET /api/v1/drivers
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css     # F1 telemetry styling & glows
│   │   │   ├── layout.tsx      # Fonts & Root Layout
│   │   │   └── page.tsx        # Hero 3D Scrollyteller & Dashboard
│   │   ├── components/
│   │   │   ├── 3d/             # R3F Canvas, CircuitRibbon, FormulaCar3D, TrajectorySplines, DynamicHUDOverlay
│   │   │   └── dashboard/      # HeaderNav, CircuitExplorer, DriverProfiler, ReplaySandbox, StrategyOptimizer
│   │   ├── lib/
│   │   │   ├── api.ts          # Backend API Client with client fallbacks
│   │   │   └── splineData.ts   # 3D CatmullRomCurve3 track data & stages
│   │   └── types/
│   │       └── telemetry.ts    # TypeScript definitions
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── start.bat
└── README.md
```
