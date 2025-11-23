import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitData } from '../types';
import { calculateOrbitPosition } from '../utils/orbitalPhysics';

interface OrbitLineProps {
  orbit: OrbitData;
  color: string;
  parentId?: string;
}

export const OrbitLine: React.FC<OrbitLineProps> = ({ orbit, color, parentId }) => {
  const lineRef = useRef<THREE.Line>(null);
  const parentPosRef = useRef(new THREE.Vector3());
  const { scene } = useThree();

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

  useFrame(() => {
    if (!lineRef.current) return;
    if (parentId) {
      const parentObj = scene.getObjectByName(parentId);
      if (parentObj) {
        parentObj.getWorldPosition(parentPosRef.current);
      } else {
        parentPosRef.current.set(0, 0, 0);
      }
      lineRef.current.position.copy(parentPosRef.current);
    } else {
      lineRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <line ref={lineRef}>
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
