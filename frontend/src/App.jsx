import React, { useState, useEffect, Component } from 'react';
import { Shield, ShieldAlert, Cpu, Activity, Signal, Zap, Command, Menu } from 'lucide-react';
import NetworkCanvas from './components/NetworkCanvas';
import DashboardOverlay from './components/UI/DashboardOverlay';
import LoginScreen from './components/Auth/LoginScreen';
import Terminal from './components/UI/Terminal';
import { fetchNetworkState, executeDeviceAction, triggerReset } from './services/api';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900 text-white p-10 font-mono w-screen h-screen">
          <h1 className="text-3xl mb-4">React Error Captured</h1>
          <p className="mb-4">{this.state.error && this.state.error.toString()}</p>
          <pre className="text-sm bg-black p-4 overflow-auto">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [networkState, setNetworkState] = useState({ devices: [], logs: [], stats: {} });
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadState = async () => {
      try {
        const state = await fetchNetworkState();
        if (state && state.devices && state.logs) {
          setNetworkState(state);
          if (selectedDevice) {
            const updatedDevice = state.devices.find(d => d.id === selectedDevice.id);
            if (updatedDevice) {
              setSelectedDevice(updatedDevice);
            } else {
              setSelectedDevice(null);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch network state", error);
      }
    };
    
    loadState();
    const interval = setInterval(loadState, 2000);
    return () => clearInterval(interval);
  }, [selectedDevice?.id, isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="relative w-screen h-screen bg-cyber-dark overflow-hidden text-slate-200">
      <div className="absolute inset-0 z-0">
        <NetworkCanvas 
          devices={networkState.devices || []} 
          onDeviceSelect={setSelectedDevice}
          selectedDeviceId={selectedDevice?.id}
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
        <header className="h-16 glass-panel border-b border-l-0 border-r-0 border-t-0 border-neon-blue/20 flex items-center justify-between px-6 pointer-events-auto rounded-none">
          <div className="flex items-center gap-3">
            <img src="/soc-logo.jpg" alt="CIrcLe Logo" className="w-10 h-10 object-contain invert" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider flex items-center gap-1">
                <span className="text-neon-blue text-glow-blue">CIr</span>
                <span className="text-white font-light">cLe</span>
              </h1>
              <p className="text-[10px] text-neon-blue/70 tracking-widest uppercase font-mono mt-0.5">Advanced Threat Operations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 font-mono text-sm">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${networkState.stats?.threatLevel === 'High' ? 'border-neon-red bg-neon-red/10 animate-pulse' : 'border-neon-green/30 bg-neon-green/5'}`}>
              <ShieldAlert className={`w-4 h-4 ${networkState.stats?.threatLevel === 'High' ? 'text-neon-red' : 'text-neon-green'}`} />
              <span className={networkState.stats?.threatLevel === 'High' ? 'text-neon-red' : 'text-neon-green/80'}>
                THREAT LEVEL: {networkState.stats?.threatLevel || 'OK'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1"><Cpu className="w-4 h-4 text-neon-blue/70" /> {networkState.stats?.totalDevices || 0} Nodes</span>
              <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-neon-yellow/70" /> {networkState.stats?.activeThreats || 0} Anomalies</span>
            </div>

            <div className="hidden lg:flex items-center gap-4 text-slate-400 border-l border-slate-700 pl-4 ml-2">
              <span className="flex items-center gap-1 text-[10px] text-neon-purple"><Activity className="w-3 h-3" /> SIEM: ACTIVE</span>
              <span className="flex items-center gap-1 text-[10px] text-neon-green"><Shield className="w-3 h-3" /> IDS/IPS: ENFORCING</span>
            </div>
            
            <button 
              onClick={() => setDemoMode(!demoMode)}
              className={`ml-4 px-3 py-1 rounded border transition-all ${demoMode ? 'bg-neon-purple/20 border-neon-purple text-neon-purple text-glow-purple shadow-[0_0_8px_rgba(217,0,255,0.3)]' : 'bg-transparent border-slate-700 text-slate-500 hover:text-slate-300 pointer-events-auto'}`}
            >
              <Command className="w-4 h-4 inline mr-2" />
              DEMO MODE
            </button>
          </div>
        </header>

        <DashboardOverlay 
          networkState={{ devices: networkState.devices || [], logs: networkState.logs || [] }} 
          selectedDevice={selectedDevice}
          onCloseDevice={() => setSelectedDevice(null)}
          demoMode={demoMode}
        />
        
        <Terminal onCommand={async (action, target) => {
          if (action === 'block') {
             const device = networkState.devices?.find(d => d.ip === target);
             if (device) executeDeviceAction(device.id, 'block');
          } else if (action === 'reset') {
             await triggerReset();
          }
        }} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
