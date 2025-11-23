import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitalElements, OrbitData } from '../types';
import { calculateOrbitPosition } from '../utils/orbitalPhysics';

interface OrbitLineProps {
  orbit: OrbitData;
  color: string;
}

export const OrbitLine: React.FC<OrbitLineProps> = ({ orbit, color }) => {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    // Loop through one full period (0 to T)
    // calculateOrbitPosition takes "timeYears". 
    // We just need to sweep Mean Anomaly from 0 to 2PI really.
    // calculateOrbitPosition uses timeYears to calculate M based on Period.
    // So if we iterate t from 0 to Period, we get a full circle.
    
    const period = orbit.sidereal_orbital_period_years || 1;
    
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * period;
      pts.push(calculateOrbitPosition(orbit.elements, period, t));
    }
    return pts;
  }, [orbit]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} opacity={0.3} transparent linewidth={1} />
    </line>
  );
};