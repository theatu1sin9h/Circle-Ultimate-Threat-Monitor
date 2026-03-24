import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import DeviceNode from './DeviceNode';

export default function NetworkGraph({ devices, onDeviceSelect, selectedDeviceId }) {
  // Separate core from edge devices
  const coreNode = devices.find(d => d.isCore);
  const edgeDevices = devices.filter(d => !d.isCore);

  // Distribute edge devices in a circle/sphere around the core
  const radius = 12;
  
  const nodesWithPositions = useMemo(() => {
    if (!coreNode) return [];
    
    const corePos = [0, 0, 0];
    const positioned = [{ ...coreNode, position: corePos }];
    
    const count = edgeDevices.length;
    edgeDevices.forEach((device, i) => {
      // Simple circular distribution with slight random vertical offset
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius + (Math.random() * 2 - 1);
      const z = Math.sin(angle) * radius + (Math.random() * 2 - 1);
      const y = (Math.random() * 4) - 2; // -2 to 2 height
      
      positioned.push({ ...device, position: [x, y, z] });
    });
    
    return positioned;
  }, [devices]);

  return (
    <group>
      {/* Draw connections from edge nodes to core */}
      {nodesWithPositions.filter(d => !d.isCore).map(device => {
        // Line color depends on connection status
        let lineColor = "#00e5ff"; // Default safe
        if (device.status === 'suspicious') lineColor = "#ffaa00";
        if (device.status === 'threat') lineColor = "#ff2a2a";
        if (device.status === 'blocked') lineColor = "#334155";
        
        return (
          <Line
            key={`line-${device.id}`}
            points={[[0, 0, 0], device.position]}
            color={lineColor}
            opacity={device.status === 'blocked' ? 0.1 : 0.4}
            transparent
            lineWidth={device.status === 'threat' ? 2 : 1}
            dashed={device.status === 'suspicious' || device.status === 'blocked'}
            dashScale={device.status === 'blocked' ? 50 : 20}
          />
        );
      })}

      {/* Render the nodes */}
      {nodesWithPositions.map((device) => {
        // Add random slight movement
        const timeOffset = Math.random() * 100;
        
        return (
          <DeviceNode
            key={device.id}
            device={device}
            position={device.position}
            isSelected={selectedDeviceId === device.id}
            onClick={() => onDeviceSelect(device)}
            timeOffset={timeOffset}
          />
        );
      })}
    </group>
  );
}
