import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function DeviceNode({ device, position, isSelected, onClick, timeOffset }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Determine neon colors based on status
  let neonColor = new THREE.Color("#00e5ff"); // Safe/Trusted (Blue-Cyan)
  let emissiveIntensity = 2; // Base glow

  if (device.status === 'suspicious') {
    neonColor = new THREE.Color("#ffaa00"); // Yellow
    emissiveIntensity = 3;
  } else if (device.status === 'threat') {
    neonColor = new THREE.Color("#ff2a2a"); // Red
    emissiveIntensity = 4;
  } else if (device.status === 'blocked') {
    neonColor = new THREE.Color("#334155"); // Dim Grey
    emissiveIntensity = 0.5;
  } else if (device.status === 'unprotected') {
    neonColor = new THREE.Color("#ffffff"); // White
    emissiveIntensity = 4; // High emissive to make the heartbeat blink intensely
  } else if (device.isCore) {
    neonColor = new THREE.Color("#00ff88"); // Core = Neon Green
    emissiveIntensity = 3;
  }

  // Animate node (breathing effect and slight floating hover)
  useFrame((state) => {
    if (!meshRef.current || device.status === 'blocked') return;
    
    const time = state.clock.getElapsedTime() + (timeOffset || 0);
    
    // Float movement
    meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2;
    
    // Activity pulse heartbeat based on simulated traffic
    if (materialRef.current && device.status !== 'blocked') {
      // Pulse multiplier based on activity/status
      const pulseRate = device.status === 'threat' ? 10 : (device.status === 'unprotected' ? 15 : (device.isCore ? 1 : 2));
      const baseline = isSelected || hovered ? emissiveIntensity * 1.5 : emissiveIntensity;
      // Inject more aggressive pulse for unprotected status
      const activityScale = device.status === 'unprotected' ? 0.15 : 0.05;
      materialRef.current.emissiveIntensity = baseline + Math.sin(time * pulseRate) * (device.activity * activityScale);
    }
  });

  const nodeScale = device.isCore ? 1.5 : (isSelected ? 1.2 : 1.0);

  return (
    <group position={position}>
      {/* Interactive Mesh */}
      <mesh
        ref={meshRef}
        scale={[nodeScale, nodeScale, nodeScale]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
          wireframe={device.status === 'blocked'}
          transparent={device.status === 'blocked'}
          opacity={device.status === 'blocked' ? 0.3 : 1}
        />
      </mesh>

      {/* Selection Ring */}
      {isSelected && (
        <mesh rotation-x={Math.PI / 2}>
          <ringGeometry args={[1.5, 1.6, 32]} />
          <meshBasicMaterial color={neonColor} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Floating HTML Label */}
      {(hovered || isSelected || device.isCore) && (
        <Html position={[0, device.isCore ? 2.5 : 1.8, 0]} center zIndexRange={[100, 0]}>
          <div className={`glass-panel px-3 py-1.5 rounded-md pointer-events-none transition-all whitespace-nowrap
            ${device.status === 'threat' ? 'border-neon-red/60 animate-pulse' : ''}
            ${device.status === 'suspicious' ? 'border-neon-yellow/60' : ''}
            ${device.status === 'unprotected' ? 'border-white/80 animate-pulse' : ''}
          `}>
            <div className={`text-xs font-bold tracking-wider mb-0.5
              ${device.status === 'threat' ? 'text-neon-red' : ''}
              ${device.status === 'suspicious' ? 'text-neon-yellow' : ''}
              ${device.status === 'unprotected' ? 'text-white' : ''}
              ${device.status === 'trusted' ? 'text-neon-blue' : ''}
              ${device.status === 'blocked' ? 'text-slate-500' : ''}
            `}>
              {device.ip}
            </div>
            {device.isCore && <div className="text-[10px] text-neon-green font-mono uppercase">CORE ROUTER</div>}
            {!device.isCore && <div className="text-[10px] text-slate-400 font-mono">{device.type} ({device.trustScore}/100)</div>}
          </div>
        </Html>
      )}
    </group>
  );
}
