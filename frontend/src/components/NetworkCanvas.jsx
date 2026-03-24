import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import NetworkGraph from './NetworkGraph';

export default function NetworkCanvas({ devices, onDeviceSelect, selectedDeviceId }) {
  return (
    <Canvas
      camera={{ position: [0, 15, 25], fov: 50 }}
      gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]} // Support high dpi displays but cap at 2 for performance
      style={{ background: '#050814' }}
    >
      <color attach="background" args={['#050814']} />
      
      {/* Lights */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#00e5ff" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" distance={20} />

      {/* Galaxy / Hacker space background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Suspense fallback={null}>
        <group position={[0, -2, 0]}>
          <NetworkGraph 
            devices={devices} 
            onDeviceSelect={onDeviceSelect}
            selectedDeviceId={selectedDeviceId}
          />
        </group>
      </Suspense>

      {/* Camera Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2 + 0.1} // Allow looking slightly from below but mostly from top/side
        minDistance={10}
        maxDistance={50}
      />

      {/* Cyberpunk Neon Glow Post-processing */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.2} // Darker things don't glow, bright things do
          luminanceSmoothing={0.9}
          intensity={1.5} 
          quality={8}
          mipmapBlur 
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer> 
    </Canvas>
  );
}
