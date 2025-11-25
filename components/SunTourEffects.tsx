import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SunTourEffectsProps {
  active?: boolean;
}

/**
 * Lightweight placeholder flare/prominence effect for tour mode.
 * Uses simple additive blended rings/torus instead of textures.
 */
export const SunTourEffects: React.FC<SunTourEffectsProps> = ({ active = false }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh>
        <ringGeometry args={[0.18, 0.25, 64]} />
        <meshBasicMaterial
          color="#ff9a3c"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[0.22, 0.3, 64]} />
        <meshBasicMaterial
          color="#ffd166"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0.32, 0.05, 0]}>
        <torusGeometry args={[0.07, 0.012, 12, 48, Math.PI * 1.5]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[-0.28, -0.03, 0.12]} rotation={[0.3, 0.3, 0]}>
        <torusGeometry args={[0.06, 0.01, 12, 48, Math.PI * 1.2]} />
        <meshBasicMaterial
          color="#ff8c69"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
