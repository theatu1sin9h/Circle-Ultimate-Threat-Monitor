import React, { useState } from 'react';
import { 
  Server, Shield, AlertTriangle, XCircle, CheckCircle, 
  Activity, Zap, Search, ChevronRight, StopCircle, Skull, Command
} from 'lucide-react';
import { triggerInjectSuspicious, triggerAttack, executeDeviceAction, triggerReset, addSystemLog, updateSystemConfig } from '../../services/api';
import { playClickSound, playAlertSound } from '../../services/audio';

export default function DashboardOverlay({ networkState, selectedDevice, onCloseDevice, demoMode }) {
  const { devices, logs } = networkState;

  // Render trust score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-neon-green';
    if (score >= 40) return 'text-neon-yellow';
    return 'text-neon-red';
  };

  const statusBorder = (status) => {
    if (status === 'trusted') return 'border-neon-blue/30';
    if (status === 'suspicious') return 'border-neon-yellow/60';
    if (status === 'threat') return 'border-neon-red shadow-[0_0_15px_rgba(255,42,42,0.3)] animate-pulse';
    return 'border-slate-700 opacity-50';
  };

  return (
    <div className="flex-1 flex pointer-events-none p-4 pb-8 overflow-hidden">
      
      {/* Left Panel: Device Discovery */}
      <div className="w-80 flex flex-col gap-4 pointer-events-auto">
        <div className="glass-panel p-4 flex-1 flex flex-col overflow-hidden max-h-full">
          <div className="flex items-center justify-between mb-4 border-b border-neon-blue/20 pb-2">
            <h2 className="text-lg font-bold text-glow-blue flex items-center gap-2">
              <Server className="w-5 h-5 text-neon-blue" />
              Network Nodes
            </h2>
            <div className="bg-neon-blue/10 px-2 py-0.5 rounded text-xs text-neon-blue">{devices.length} Live</div>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by IP or Vendor..." 
              className="w-full bg-black/40 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-neon-blue/50 text-slate-300 placeholder-slate-600"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {devices.map(device => (
              <div 
                key={device.id} 
                className={`p-3 rounded border bg-black/40 cursor-pointer transition-all hover:bg-black/60
                  ${selectedDevice?.id === device.id ? 'border-neon-blue bg-neon-blue/10' : statusBorder(device.status)}
                `}
                onClick={() => { /* Click handled via canvas usually, but could integrate here */ }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-sm text-slate-200">{device.ip}</span>
                  <span className={`text-xs font-bold ${getScoreColor(device.trustScore)}`}>
                    {device.trustScore}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="truncate w-3/4">{device.vendor || device.type}</span>
                  <span className="uppercase text-[10px]">{device.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle/Bottom Area: Selected Device Action Panel */}
      <div className="flex-1 flex items-end justify-center pointer-events-none px-4 mb-4">
        {selectedDevice && (
          <div className="w-[500px] glass-panel pointer-events-auto border-t-2 border-t-neon-blue custom-slide-up bg-cyber-dark/90">
            <div className="flex justify-between items-start p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg flex items-center justify-center 
                  ${selectedDevice.status === 'threat' ? 'bg-neon-red/20 text-neon-red' : 
                    selectedDevice.status === 'suspicious' ? 'bg-neon-yellow/20 text-neon-yellow' : 
                    'bg-neon-blue/20 text-neon-blue'}`}
                >
                  {selectedDevice.status === 'threat' ? <Skull className="w-8 h-8 animate-pulse" /> : 
                   selectedDevice.status === 'suspicious' ? <AlertTriangle className="w-8 h-8" /> : 
                   <Shield className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-mono tracking-wide">{selectedDevice.ip}</h3>
                  <div className="text-sm text-slate-400 font-mono tracking-widest uppercase">{selectedDevice.mac}</div>
                </div>
              </div>
              <button onClick={onCloseDevice} className="text-slate-500 hover:text-white"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-4 text-sm border-b border-slate-800">
              <div>
                <span className="text-slate-500 block text-xs uppercase mb-1">Device Type</span>
                <span className="text-slate-200">{selectedDevice.type} ({selectedDevice.vendor})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase mb-1">Trust Score</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ 
                        width: `${selectedDevice.trustScore}%`, 
                        backgroundColor: selectedDevice.trustScore >= 80 ? '#00ff88' : selectedDevice.trustScore >= 40 ? '#ffaa00' : '#ff2a2a'
                      }} 
                    />
                  </div>
                  <span className={`font-bold ${getScoreColor(selectedDevice.trustScore)}`}>{selectedDevice.trustScore}/100</span>
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-xs uppercase mb-1">Current Activity</span>
                <div className="flex items-center gap-2 text-slate-300">
                  <Activity className="w-4 h-4 text-neon-blue" />
                  Bandwidth flow: {selectedDevice.activity} MB/s
                </div>
              </div>
            </div>

            <div className="p-4 flex gap-3 h-20">
              {selectedDevice.status !== 'blocked' && !selectedDevice.isCore && (
                <button 
                  onClick={() => executeDeviceAction(selectedDevice.id, 'block')}
                  className="flex-1 bg-neon-red/10 border border-neon-red text-neon-red text-glow-red hover:bg-neon-red/20 font-bold uppercase tracking-widest rounded-md flex items-center justify-center gap-2 transition-all"
                >
                  <StopCircle className="w-5 h-5" /> Terminate Access
                </button>
              )}
              {selectedDevice.status === 'blocked' && !selectedDevice.isCore && (
                <button 
                  onClick={() => executeDeviceAction(selectedDevice.id, 'allow')}
                  className="flex-1 bg-neon-green/10 border border-neon-green text-neon-green text-glow-green hover:bg-neon-green/20 font-bold uppercase tracking-widest rounded-md flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle className="w-5 h-5" /> Restore Access
                </button>
              )}
              {selectedDevice.isCore && (
                <div className="flex-1 flex items-center justify-center text-neon-green/50 font-mono text-sm border border-neon-green/20 rounded-md bg-neon-green/5 bg-stripes">
                  SYSTEM CORE SECURE
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Alerts, Logs and Demo Controls */}
      <div className="w-80 flex flex-col gap-4 pointer-events-auto">

        {/* Threat Intelligence Summary */}
        <div className="glass-panel p-4 border border-slate-700 bg-black/60">
          <h3 className="text-slate-400 font-bold tracking-widest uppercase mb-3 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon-blue" /> Defense Matrix
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
              <span className="text-slate-500 block mb-1">IDS/IPS Profile</span>
              <select 
                onChange={(e) => { 
                  playClickSound(); 
                  const val = e.target.value;
                  addSystemLog(`[DEFENSE MATRIX] IDS/IPS Profile updated to: ${val}`, "SUCCESS"); 
                  updateSystemConfig("ipsProfile", val);
                }}
                className="bg-black/40 text-neon-green border border-neon-green/30 text-[10px] w-full p-1 outline-none appearance-none cursor-pointer"
                defaultValue="Strict Enforce"
              >
                <option value="Monitor Only">Monitor Only</option>
                <option value="Balanced">Balanced</option>
                <option value="Strict Enforce">Strict Enforce</option>
                <option value="Aggressive">Aggressive</option>
              </select>
            </div>
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
              <span className="text-slate-500 block mb-1">Firewall Rules</span>
              <select 
                onChange={(e) => { 
                  playClickSound(); 
                  const val = e.target.value;
                  addSystemLog(`[DEFENSE MATRIX] Firewall Mode updated to: ${val}`, "INFO"); 
                  updateSystemConfig("firewallMode", val);
                }}
                className="bg-black/40 text-neon-blue border border-neon-blue/30 text-[10px] w-full p-1 outline-none appearance-none cursor-pointer"
                defaultValue="Default Block"
              >
                <option value="Permissive">Permissive</option>
                <option value="Default Block">Default Block</option>
                <option value="Zero-Trust">Zero-Trust</option>
                <option value="Lockdown">Lockdown</option>
              </select>
            </div>
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
              <span className="text-slate-500 block mb-1">DDoS Mitigation</span>
              <select 
                onChange={(e) => { 
                  playClickSound(); 
                  const val = e.target.value;
                  addSystemLog(`[DEFENSE MATRIX] DDoS Mitigation updated to: ${val}`, "INFO");
                  updateSystemConfig("ddosMode", val);
                }}
                className="bg-black/40 text-neon-green border border-neon-green/30 text-[10px] w-full p-1 outline-none appearance-none cursor-pointer"
                defaultValue="Auto-Mitigate"
              >
                <option value="Always-On">Always-On</option>
                <option value="Auto-Mitigate">Auto-Mitigate</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700">
              <span className="text-slate-500 block mb-1">Geo-Block Lvl</span>
              <select 
                onChange={(e) => { 
                  playClickSound(); 
                  const val = e.target.value;
                  addSystemLog(`[DEFENSE MATRIX] Geo-Block Level updated to: ${val}`, "WARNING");
                  updateSystemConfig("geoBlock", val);
                }}
                className="bg-black/40 text-neon-yellow border border-neon-yellow/30 text-[10px] w-full p-1 outline-none appearance-none cursor-pointer"
                defaultValue="Level 2 (High)"
              >
                <option value="None">None</option>
                <option value="Level 1 (Medium)">Lvl 1 (Medium)</option>
                <option value="Level 2 (High)">Lvl 2 (High)</option>
                <option value="Strict Isolate">Strict Isolate</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Demo Mode Actions */}
        {demoMode && (
          <div className="glass-panel p-4 border border-neon-purple shadow-[0_0_15px_rgba(217,0,255,0.15)] bg-cyber-dark/80 backdrop-blur-xl">
            <h3 className="text-neon-purple text-glow-purple font-bold tracking-widest uppercase mb-3 flex items-center gap-2 text-sm">
              <Command className="w-4 h-4" /> Director Mode
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => { playClickSound(); triggerInjectSuspicious(); }}
                className="w-full py-2 px-3 bg-neon-yellow/10 border border-neon-yellow/50 text-neon-yellow hover:bg-neon-yellow/20 text-xs tracking-wider rounded font-mono transition-colors text-left flex justify-between items-center"
              >
                1. Inject Unknown Device <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  playAlertSound();
                  const target = networkState.devices.find(d => d.status === 'suspicious');
                  if(target) triggerAttack(target.id);
                  else alert("No suspicious device target found. Inject one first.");
                }}
                className="w-full py-2 px-3 bg-neon-red/10 border border-neon-red/50 text-neon-red hover:bg-neon-red/20 text-xs tracking-wider rounded font-mono transition-colors text-left flex justify-between items-center"
              >
                2. Trigger Attack Behavior <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { playClickSound(); triggerReset(); }}
                className="w-full py-2 px-3 mt-4 bg-neon-blue/10 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/20 text-xs tracking-wider rounded font-mono transition-colors text-left flex justify-between items-center"
              >
                3. Reset System Status <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Global Security Logs */}
        <div className="glass-panel p-0 flex flex-col overflow-hidden max-h-full flex-1">
          <div className="p-4 border-b border-neon-blue/20 flex items-center justify-between bg-black/20">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5 text-neon-blue" />
              System Logs
            </h2>
            <div className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div> Live
            </div>
          </div>
          
          <div className="p-3 overflow-y-auto flex-1 flex flex-col-reverse gap-2 font-mono text-xs">
            {logs.slice().reverse().map(log => {
              let logColor = "text-slate-400";
              let badgeColor = "bg-slate-700 text-slate-300";
              
              if (log.level === 'CRITICAL') {
                logColor = "text-neon-red";
                badgeColor = "bg-neon-red text-white";
              } else if (log.level === 'WARNING') {
                logColor = "text-neon-yellow";
                badgeColor = "bg-neon-yellow text-black";
              } else if (log.level === 'SUCCESS') {
                logColor = "text-neon-green";
                badgeColor = "bg-neon-green/20 text-neon-green";
              }

              return (
                <div key={log.id} className={`p-2 rounded bg-black/40 border-l-2 ${log.level === 'CRITICAL' ? 'border-neon-red' : log.level === 'WARNING' ? 'border-neon-yellow' : 'border-slate-700'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`px-1 rounded-[3px] text-[9px] font-bold ${badgeColor}`}>{log.level}</span>
                    <span className="text-slate-600 text-[9px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className={logColor}>{log.message}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
