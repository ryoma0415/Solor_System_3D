import React, { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBodyData } from '../types';
import { calculateOrbitPosition, MIN_VISUAL_RADIUS, PLANET_COLORS, SIZE_SCALE } from '../utils/orbitalPhysics';
import { OrbitLine } from './OrbitLine';
import { SOLAR_SYSTEM_DATA } from '../data';
const SIMULATION_SPEED = 0.005; // 例: 25%の速さ

interface CelestialBodyProps {
  data: CelestialBodyData;
  timeScale: number;
  isPaused: boolean;
  onSelect: (body: CelestialBodyData) => void;
  showHighlight?: boolean;
  selectedId?: string;
}

// Helper component to render planetary rings
const PlanetRing: React.FC<{ 
  radius: number, 
  ringData: NonNullable<CelestialBodyData['ring']>,
  tilt: number
}> = ({ radius, ringData, tilt }) => {
  const inner = radius * ringData.inner_radius_r;
  const outer = radius * ringData.outer_radius_r;
  
  // Rotate ring to align with planet equator (approximate tilt)
  const rotationX = (tilt + 90) * (Math.PI / 180);

  return (
    <mesh rotation={[rotationX, 0, 0]}>
      <ringGeometry args={[inner, outer, 64]} />
      <meshStandardMaterial 
        color={ringData.color || "#ffffff"} 
        side={THREE.DoubleSide} 
        transparent 
        opacity={ringData.opacity || 0.5}
      />
    </mesh>
  );
};

export const CelestialBody: React.FC<CelestialBodyProps> = ({ 
  data, 
  timeScale, 
  isPaused, 
  onSelect,
  showHighlight = false,
  selectedId
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  const { scene } = useThree();
  const parentPositionRef = useRef(new THREE.Vector3());
  const modelRef = useRef<THREE.Object3D>(null);
  const isPointerless = data.category === 'moon' || data.category === 'artificial_satellite';
  // Load texture with R3F loader; on error, fallback to color
  const texture = useTexture(data.textureMap || '', undefined, () => null);
  const parentBody = useMemo(
    () => (data.parent_id ? SOLAR_SYSTEM_DATA.bodies.find((b) => b.id === data.parent_id) : null),
    [data.parent_id]
  );
  const siblingSatellites = useMemo(
    () =>
      SOLAR_SYSTEM_DATA.bodies
        .filter(
          (b) =>
            b.parent_id === data.parent_id &&
            (b.category === 'moon' || b.category === 'artificial_satellite')
        )
        .map((b) => b.id)
        .sort(),
    [data.parent_id]
  );
  const siblingIndex = useMemo(
    () => siblingSatellites.findIndex((id) => id === data.id),
    [siblingSatellites, data.id]
  );

  const toAssetPath = (path: string) => {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  };
  const issModel = useGLTF(toAssetPath('/models/iss.glb'));
  useGLTF.preload(toAssetPath('/models/iss.glb'));

  // Compute scale for ISS so its longest dimension matches scaled physical size with a visibility floor.
  const issScale = useMemo(() => {
    if (data.id !== 'iss') return null;
    const dims = data.physical.dimensions_m;
    const lengthM = dims?.span ?? dims?.length ?? 100; // prefer full span
    const meterToAU = 1 / 149597870700; // 1 m in AU
    const targetRadius = Math.max((lengthM * meterToAU * SIZE_SCALE) / 2, MIN_VISUAL_RADIUS);
    const targetLengthAU = targetRadius * 2;
    const baseLengthAU = Math.max(lengthM * meterToAU, 1e-9);
    return targetLengthAU / baseLengthAU;
  }, [data.id, data.physical.dimensions_m]);
  
  // Calculate rotation speed relative to frame
  // Rotation period in hours. Earth ~24h.
  // We need a visual rotation speed.
  const rotationSpeed = data.physical.sidereal_rotation_period_hours 
    ? 0.02 * (24 / Math.abs(data.physical.sidereal_rotation_period_hours)) * SIMULATION_SPEED
    : 0;
  
  // Use a Ref for current orbit time to avoid re-renders on every frame
  const timeRef = useRef(0);

  // Calculate Size
  // Real size in AU: radius_km / 149597870.7
  const radiusKm = data.physical.mean_radius_km ?? data.physical.equatorial_radius_km ?? 0;
  const radiusAU = radiusKm / 149597870.7;
  // Apply visual scale factor, but ensure minimum visibility
  const visualRadius = Math.max(radiusAU * SIZE_SCALE, MIN_VISUAL_RADIUS);
  // Scale moon/satellite orbits modestly so inflated parent radius doesn't swallow them
  const parentRadiusKm =
    parentBody?.physical.mean_radius_km ?? parentBody?.physical.equatorial_radius_km ?? 0;
  const parentRadiusAU = parentRadiusKm / 149597870.7;
  const parentVisualRadius = parentRadiusAU > 0 ? Math.max(parentRadiusAU * SIZE_SCALE, MIN_VISUAL_RADIUS) : 0;
  const baseOrbitRadius = data.orbit?.elements.semi_major_axis_au ?? 0;
  const isSatellite = data.category === 'moon' || data.category === 'artificial_satellite';
  const baseOrbitScale =
    isSatellite && data.parent_id && baseOrbitRadius > 0 && parentRadiusAU > 0
      ? Math.min(
          5000, // generous cap for tiny orbits (e.g., ISS)
          Math.max(
            3, // ensure clear separation
            (parentVisualRadius * 5) / baseOrbitRadius // push orbit well beyond inflated parent radius
          )
        )
      : 1;
  const siblingSpreadMultiplier =
    isSatellite && siblingIndex >= 0 ? 1 + siblingIndex * 0.4 : 1; // stagger satellites without pulling planets
  const orbitScale = baseOrbitScale * siblingSpreadMultiplier;
  const effectiveOrbitScale = data.id === 'iss' ? orbitScale * 0.4 : orbitScale;

  // Color lookup
  const color = PLANET_COLORS[data.id] || '#ffffff';

  // Determine if this body should be highlighted
  const isSmallCategory = ['dwarf_planet', 'moon', 'artificial_satellite', 'comet'].includes(data.category);
  const isTinyBody = radiusKm === 0 || radiusKm < 1500;
  const isTarget = showHighlight && (isSmallCategory || isTinyBody);
  const isSelected = selectedId === data.id;

  // Axial Tilt (Obliquity)
  const axialTiltRad = (data.physical.axial_tilt_deg || 0) * (Math.PI / 180);

  useFrame((state, delta) => {
    if (groupRef.current && data.orbit) {
      // Update orbit position
      if (!isPaused) {
        timeRef.current += delta * timeScale * 0.5 * SIMULATION_SPEED; // Base speed
      }

      const pos = calculateOrbitPosition(
        data.orbit.elements,
        data.orbit.sidereal_orbital_period_years,
        timeRef.current
      );
      pos.multiplyScalar(effectiveOrbitScale);

      if (data.parent_id) {
        const parentObj = scene.getObjectByName(data.parent_id);
        if (parentObj) {
          parentObj.getWorldPosition(parentPositionRef.current);
        } else {
          parentPositionRef.current.set(0, 0, 0);
        }
        pos.add(parentPositionRef.current);
      } else {
        parentPositionRef.current.set(0, 0, 0);
      }

      groupRef.current.position.copy(pos);
    }

    // Self-Rotation (Visual only)
    const rotTarget = data.id === 'iss' ? modelRef.current : meshRef.current;
    if (rotTarget) {
      rotTarget.rotation.y += rotationSpeed * (isPaused ? 0 : 1);
    }
  });

  // Special case for Sun (no orbit)
  if (!data.orbit) {
    const sunScale = 0.14; 
    const renderedRadius = visualRadius * sunScale;

    return (
      <mesh 
        name={data.id}
        position={[0, 0, 0]} 
        onClick={(e) => { e.stopPropagation(); onSelect(data); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[renderedRadius, 64, 64]} /> 
        <meshBasicMaterial 
          map={texture}
          color={texture ? undefined : color} 
        />
        <pointLight intensity={1.5} color="#fff" distance={100} decay={1} />
        {hovered && (
           <Html position={[0, renderedRadius + 0.2, 0]} center>
             <div className="px-2 py-1 bg-black/50 text-white text-xs rounded pointer-events-none whitespace-nowrap border border-yellow-500/50">
               {data.name.en}
             </div>
           </Html>
        )}
      </mesh>
    );
  }

  return (
    <group>
      <OrbitLine
        orbit={data.orbit}
        color={isTarget ? '#d8b4fe' : color}
        parentId={data.parent_id ?? undefined}
        scale={effectiveOrbitScale}
      />
      
      <group 
        ref={groupRef}
        name={data.id} // The group moves in orbit
        onClick={isPointerless ? undefined : (e) => { e.stopPropagation(); onSelect(data); }}
        onPointerOver={isPointerless ? undefined : () => setHover(true)}
        onPointerOut={isPointerless ? undefined : () => setHover(false)}
      >
        {/* Rotational Group to handle Axial Tilt */}
        <group rotation={[axialTiltRad, 0, 0]}>
          {/* The Planet Mesh spins on its Y axis inside the tilted group */}
          {data.id === 'iss' && issModel ? (
            <primitive
              ref={modelRef}
              object={issModel.scene}
              scale={(issScale || 1) * (isSelected ? 6 : 1)}
              raycast={isPointerless ? () => null : undefined}
            />
          ) : (
            <mesh ref={meshRef} raycast={isPointerless ? () => null : undefined}>
              <sphereGeometry args={[visualRadius, 64, 64]} />
              <meshStandardMaterial 
                map={texture}
                color={texture ? undefined : color} 
                emissive={texture ? undefined : color}
                emissiveIntensity={texture ? 0 : 0.1}
                roughness={0.7}
                metalness={0.1}
              />
            </mesh>
          )}

          {/* Rings */}
          {data.ring && (
            <PlanetRing 
              radius={visualRadius} 
              ringData={data.ring} 
              tilt={0} // Already inside tilted group
            />
          )}
        </group>

        {/* Visual Highlight Ring (UI Helper) */}
        {isTarget && (
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[visualRadius * 1.5, visualRadius * 1.8, 32]} />
              <meshBasicMaterial color="#d8b4fe" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}

        {/* Label */}
        {!isPointerless && (hovered || isTarget) && (
          <Html position={[0, visualRadius + (isTarget ? 0.5 : 0.2), 0]} center zIndexRange={[100, 0]}>
            <div className={`
              px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap transition-all
              ${isTarget 
                ? 'bg-purple-900/80 text-white border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
                : 'bg-slate-900/80 text-white border border-slate-600 pointer-events-none'}
            `}>
              <span className="text-xs font-bold">{data.name.ja}</span>
              {hovered && <span className="text-[10px] ml-1 opacity-75">({data.name.en})</span>}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};
