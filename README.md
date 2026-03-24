<p align="center">
  <img src="frontend/public/soc-logo.jpg" width="150" alt="CIrcLe Logo" style="filter: invert(1);"/>
</p>

<h1 align="center">CIrcLe — Advanced Threat Operations</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/Flask-Python Backend-green?style=for-the-badge&logo=flask" alt="Flask" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
</p>

## 🌐 Overview
**CIrcLe** (formerly SecureEdge) is a state-of-the-art WebGL powered cybersecurity dashboard. Designed for high-fidelity situational awareness, it transforms raw network traffic analytics into a fully interactive 3D command center.

<p align="center">
  <img src="docs/dashboard.webp" alt="System Dashboard" width="800" />
</p>

## ⚡ Core Systems Architecture

### 1. 3D WebGL Network Mapping
Built top-to-bottom using `@react-three/fiber` and `@react-three/drei`. The engine renders the central Core Router and dynamic edge nodes, utilizing custom Bloom post-processing to achieve the glowing cyberpunk aesthetic. Nodes breathe, pulse, and physically react to network traffic latency.

### 2. Live Threat Intelligence (Defense Matrix)
An interactive Security Operations Center (SOC) panel that allows operators to enforce live rules:
- **Intrusion Prevention (IDS/IPS)**: Set to *Aggressive* to enable Active Auto-Remediation timeouts.
- **Firewall Rules**: Switch between *Permissive*, *Default Block*, *Zero-Trust*, and *Lockdown*.
- **Volumetric Shielding**: Enable *Always-On* DDoS mitigation to automatically absorb attacks.
- **Geo-Fencing**: Configure global IP isolation.

### 3. Asynchronous Terminal Interface
An integrated OS-level terminal simulation built with `framer-motion` for drag-and-drop kinetics. Includes custom recursive parsers mimicking genuine network commands:
- `nmap [ip]`: Executes a simulated port discovery.
- `ping [ip]`: Streams simulated ICMP echo replies.
- `whois [domain]`: Pulls mock registration data.
- `traceroute [ip]`: Simulates network hop latency.
- `reset`: Flushes all SOC alerts and restores the 3D grid.

## 🚀 Installation & Build Guide

### Prerequisites
- Python 3.10+
- Node.js v15+

### Initialization
To run the full stack locally, launch the data engine and the WebGL renderer simultaneously.

```bash
# 1. Start the Python State Engine
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt
python app.py

# 2. Start the WebGL Frontend Client
cd frontend
npm install
npm run dev
```

## 🛡️ Dynamic Response Engine
The backend engine (Flask) monitors the **Defense Matrix** state. If a threat enters the system while the Matrix enforces `Zero-Trust`, the backend instantly overrides standard trust protocols, drops the payload's score to critical, and commands the Three.js renderer to paint the node red and pulse aggressively. It is a fully closed-loop reactive pipeline built for visual storytelling.

---
*Built for the next generation of Cyber Intelligence.*