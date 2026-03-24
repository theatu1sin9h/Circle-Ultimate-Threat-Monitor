import React, { useState, useEffect } from 'react';
import { Shield, Lock, Terminal as TerminalIcon } from 'lucide-react';
import { playClickSound, playHoverSound } from '../../services/audio';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('IDLE'); // IDLE, AUTHENTICATING, SUCCESS, DENIED
  const [textEffect, setTextEffect] = useState('');

  // Matrix-style text scrambling effect
  useEffect(() => {
    if (status === 'AUTHENTICATING') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
      let i = 0;
      const interval = setInterval(() => {
        setTextEffect(Array(15).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(''));
        i++;
        if (i > 15) {
          clearInterval(interval);
          if (username && password) {
            setStatus('SUCCESS');
            setTimeout(onLogin, 1000);
          } else {
            setStatus('DENIED');
            setTimeout(() => setStatus('IDLE'), 2000);
          }
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [status, username, password, onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    setStatus('AUTHENTICATING');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyber-dark overflow-hidden font-mono uppercase">
      {/* Background Grid & Glitch effects could go here, for now a simple radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,rgba(0,0,0,1)_100%)] pointer-events-none"></div>
      
      <div className="relative z-10 p-12 glass-panel border border-neon-blue/30 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(0,229,255,0.1)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4">
            <img src="/soc-logo.jpg" alt="CIrcLe Logo" className="w-full h-full object-contain invert" />
          </div>
          <h1 className="text-4xl font-bold tracking-[0.2em] flex items-center gap-1">
            <span className="text-neon-blue text-glow-blue">CIr</span>
            <span className="text-white font-light">cLe</span>
          </h1>
          <p className="text-xs tracking-[0.3em] text-neon-blue/60 mt-3">RESTRICTED ACCESS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-neon-blue/80 mb-2 tracking-widest pl-1">OPERATIVE ID</label>
            <div className="relative">
              <TerminalIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                className="w-full bg-black/60 border border-slate-700 text-neon-blue px-10 py-2 focus:outline-none focus:border-neon-blue/80 transition-colors placeholder-slate-700"
                placeholder="ADMIN"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onMouseEnter={playHoverSound}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-neon-blue/80 mb-2 tracking-widest pl-1">SECURITY KEY</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                className="w-full bg-black/60 border border-slate-700 text-neon-blue px-10 py-2 focus:outline-none focus:border-neon-blue/80 transition-colors placeholder-slate-700 font-sans tracking-[0.3em]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onMouseEnter={playHoverSound}
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={status !== 'IDLE'}
              onMouseEnter={playHoverSound}
              className={`w-full py-3 border tracking-widest font-bold transition-all relative overflow-hidden group
                ${status === 'IDLE' ? 'border-neon-blue text-neon-blue hover:bg-neon-blue/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 
                  status === 'AUTHENTICATING' ? 'border-neon-yellow text-neon-yellow animate-pulse' :
                  status === 'SUCCESS' ? 'border-neon-green text-neon-green bg-neon-green/10' :
                  'border-neon-red text-neon-red bg-neon-red/10'
                }
              `}
            >
              {status === 'IDLE' && "INITIALIZE CONNECTION"}
              {status === 'AUTHENTICATING' && `DECRYPTING [${textEffect}]`}
              {status === 'SUCCESS' && "ACCESS GRANTED"}
              {status === 'DENIED' && "ACCESS DENIED"}
            </button>
          </div>
        </form>
        
        {/* Decorative corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-blue/50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-blue/50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-blue/50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-blue/50"></div>
      </div>
    </div>
  );
}
