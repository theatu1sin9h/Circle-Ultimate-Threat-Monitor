import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, GripHorizontal } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';
import { playClickSound, playAlertSound } from '../../services/audio';

export default function Terminal({ onCommand }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    "CIRCLE THREAT INTEL TERMINAL v3.0",
    "Type 'help' for available commands or press ESC to close."
  ]);
  const [inputTitle, setInputTitle] = useState('');
  const inputRef = useRef(null);
  const dragControls = useDragControls();

  // Keyboard shortcut to open (Ctrl+`)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '`') {
        setIsOpen(prev => !prev);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-scroll to bottom of history
  const historyEndRef = useRef(null);
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputTitle.trim();
      if (!cmd) return;
      
      playClickSound();
      const newHistory = [...history, `> ${cmd}`];
      
      // Basic CLI logic
      const args = cmd.split(' ');
      const action = args[0].toLowerCase();

      switch (action) {
        case 'help':
          newHistory.push("Available commands: clear, help, scan [ip], block [ip], override, nmap [ip], ping [ip], whois [domain], traceroute [ip], reset");
          break;
        case 'clear':
          setHistory([]);
          setInputTitle('');
          return;
        case 'ping':
          newHistory.push(`PING ${args[1] || '8.8.8.8'} 56(84) bytes of data.`);
          for(let i=1; i<=4; i++) {
            setTimeout(() => setHistory(h => [...h, `64 bytes from ${args[1] || '8.8.8.8'}: icmp_seq=${i} ttl=117 time=${(12 + Math.random()*10).toFixed(1)} ms`]), i * 800);
          }
          break;
        case 'nmap':
          newHistory.push(`Starting Nmap 7.93 ( https://nmap.org ) at ${new Date().toLocaleTimeString()} against ${args[1] || '192.168.1.0/24'}...`);
          setTimeout(() => setHistory(h => [...h, 
            "Host is up (0.0021s latency).",
            "PORT     STATE SERVICE",
            "22/tcp   open  ssh",
            "80/tcp   open  http",
            "443/tcp  open  https",
            "Nmap done: 1 IP address (1 host up) scanned in 1.43 seconds."
          ]), 1500);
          break;
        case 'scan':
          newHistory.push(`[SYSTEM] Initiating deep port scan on ${args[1] || 'ALL'}...`);
          setTimeout(() => setHistory(h => [...h, `[SYSTEM] Scan complete. 0 vulnerabilities found.`]), 2000);
          break;
        case 'whois':
          newHistory.push(`Querying WHOIS database for ${args[1] || 'domain'}...`);
          setTimeout(() => setHistory(h => [...h, `Registrar: MockRegistry Inc.`, `Creation Date: 1999-01-01`, `Name Servers: ns1.circle.local, ns2.circle.local`]), 1000);
          break;
        case 'traceroute':
          newHistory.push(`traceroute to ${args[1] || 'target'} (192.168.1.200), 30 hops max`);
          setTimeout(() => setHistory(h => [...h, `1  192.168.1.1 (Core Router)  0.2ms`, `2  10.0.0.5 (Firewall)  1.1ms`, `3  ${args[1] || 'target'}  2.4ms`]), 1500);
          break;
        case 'block':
          if (!args[1]) {
             newHistory.push("[ERROR] Target IP required.");
          } else {
             newHistory.push(`[ACTION] Executing firewall rule drop against ${args[1]}`);
             onCommand && onCommand('block', args[1]); 
          }
          break;
        case 'override':
          playAlertSound();
          newHistory.push("[WARNING] SYSTEM OVERRIDE PROTOCOL INITIATED.");
          newHistory.push("[x] Security protocols disengaged.");
          break;
        case 'reset':
          newHistory.push("[SYSTEM] Cleaning up SOC logs and resetting demonstration mock nodes...");
          onCommand && onCommand('reset', null);
          break;
        default:
          newHistory.push(`[ERROR] Command protocol not recognized: ${action}`);
      }
      
      setHistory(newHistory);
      setInputTitle('');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="fixed bottom-4 left-4 z-40 bg-black/60 border border-slate-700 px-4 py-2 text-slate-500 font-mono text-xs rounded hover:border-neon-blue hover:text-neon-blue transition-colors flex items-center gap-2 pointer-events-auto"
      >
        <TerminalIcon className="w-4 h-4" /> [CTRL+`] Open Terminal
      </button>
    );
  }

  return (
    <motion.div 
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      className="fixed bottom-4 left-4 z-50 w-[500px] h-[300px] glass-panel border-t-neon-blue border-t-2 flex flex-col pointer-events-auto shadow-2xl bg-black/90"
    >
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="flex items-center justify-between p-2 cursor-move border-b border-slate-800 bg-slate-900/50"
      >
        <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold flex items-center gap-2 select-none">
          <GripHorizontal className="w-3 h-3 text-slate-600" />
          <TerminalIcon className="w-3 h-3 text-neon-blue" /> SOC TERMINAL
        </span>
        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white pointer-events-auto">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
        {history.map((line, i) => (
          <div key={i} className={line.includes('[ERROR]') ? 'text-neon-red' : line.includes('[WARNING]') ? 'text-neon-yellow' : line.startsWith('>') ? 'text-white' : 'text-neon-blue/80'}>
            {line}
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>

      <div className="p-2 border-t border-slate-800 flex items-center font-mono text-xs text-neon-blue pointer-events-auto">
        <span className="mr-2">&gt;</span>
        <input 
          ref={inputRef}
          type="text" 
          className="flex-1 bg-transparent border-none focus:outline-none text-white appearance-none"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
        />
      </div>
    </motion.div>
  );
}
