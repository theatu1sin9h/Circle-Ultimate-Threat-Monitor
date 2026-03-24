# 🌐 CIrcLe - Advanced Threat Operations

A high-end, futuristic **3D Cybersecurity Network Monitoring Platform** and Security Operations Center (SOC) simulation. Designed for presentations, hackathons, and demonstrations, **CIrcLe** utilizes WebGL and modern web technologies to create a stunning, interactive storyline environments.

## ✨ Features

- **3D Network Visualization (WebGL)**: Built with React Three Fiber. Watch as the central Core Router pulses with data, while dynamic Edge Nodes shift colors in real-time based on their network trust scores.
- **Cyberpunk Aesthetic**: Deep dark mode, neon glowing `Bloom` post-processing effects, glassmorphic UI overlays, and advanced micro-animations.
- **Interactive Defense Matrix**: A fully functional mock SOC panel. Change your Firewall Rules, DDoS Mitigation, Geo-Block Level, and IDS/IPS Profiles on the fly.
- **Dynamic Threat Policies**: The system reacts to your configurations! If you set the firewall to "Zero-Trust", any injected unknown network devices instantly bypass the warning phase and spawn as highly-critical **flashing red threats**. If you switch to "Permissive", they blink white as **unprotected nodes**.
- **Integrated Floating Terminal**: Press ``CTRL + ` `` to open a draggable, framer-motion built SOC terminal. Execute deep mockup commands like `nmap [ip]`, `ping`, `whois`, `traceroute`, and `reset` to clear the network history.
- **Web Audio API Engine**: Completely native synthesized audio. Enjoy sci-fi hover bloops, interface clicks, and an aggressive sweeping alarm siren when attack behaviors are detected.
- **Director's "Demo Mode"**: A hidden presenter panel that allows you to seamlessly inject "Unknown Devices", trigger simulated port scans/attacks, and narrate a powerful cybersecurity presentation.

## 🏗️ Technology Stack

**Frontend (Client Presentation)**:
- **React 19** + **Vite**
- **Tailwind CSS v4** (Custom Cyberpunk Neon utility classes)
- **Three.js** & **@react-three/fiber** & **@react-three/drei**
- **Framer Motion** (Drag-and-drop terminal, UI transitions)
- **Lucide-React** (Futuristic Iconography)

**Backend (State & Simulation Engine)**:
- **Python Flask** (Serves REST API routes)
- **flask-cors**
- In-memory mock database and live SOC log-event queuing system.

## 🚀 Installation & Setup

To run CIrcLe locally, you will need to start both the Python backend state manager and the Vite frontend server.

### 1. Backend Setup
The backend manages the network state, device injection, live logging, and dynamic security rules.
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install Flask flask-cors
python app.py
```
*The backend should now run on `http://localhost:5000`.*

### 2. Frontend Setup
The frontend renders the 3D WebGL engine and the user interface.
```bash
cd frontend
npm install
npm run dev
```
*The frontend should now run on `http://localhost:5173`.*

## 📖 How to Run the Presentation Storyline

CIrcLe was built specifically to be demonstrated. Follow this script for a perfect presentation:

1. **Initialization**: Open `localhost:5173`. Marvel at the Matrix-style hacking text and glowing logo. Click **"INITIALIZE CONNECTION"**.
2. **Observe**: Point out the live System Logs, Threat Indicators, and the spinning 3D network.
3. **Tighten Security**: Click "DEMO MODE" (bottom left). Adjust the *Defense Matrix* dropdowns on the right panel (e.g. change Firewall to *Zero-Trust*). Note the audible click and the new system log appearing below it in real-time.
4. **The Breach**: In the Demo Menu, click **"1. Inject Unknown Device"**. Watch the red node spawn instantly in the 3D space, and a CRITICAL alert pop up.
5. **The Investigation**: Press ``CTRL + ` `` to open the terminal. Drag it nicely. Type `nmap 192.168.1.144` to "scan" the attacker. 
6. **The Defense**: Click on the flashing Red Node in the 3D space. Click **"BLOCK DEVICE"**. Watch the node power down, turn grey, and disconnect from the network.
7. **Reset**: Type `reset` in the terminal to clear the history and prepare for the next audience!