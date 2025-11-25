import React from 'react';
import { CelestialBody } from './CelestialBody';
import { SunTourEffects } from './SunTourEffects';
import { SOLAR_SYSTEM_DATA } from '../data';
import { CelestialBodyData } from '../types';

interface Scene3DProps {
  onSelect: (body: CelestialBodyData) => void;
  timeScale: number;
  isPaused: boolean;
  showHighlights?: boolean;
  selectedId?: string | null;
  orbitSpeedOverrides?: Partial<Record<string, number>>;
  showSunEffects?: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  onSelect,
  timeScale,
  isPaused,
  showHighlights = false,
  selectedId,
  orbitSpeedOverrides,
  showSunEffects = false
}) => {
  return (
    <>
      {SOLAR_SYSTEM_DATA.bodies.map((body) => (
        <CelestialBody 
          key={body.id}
          data={body}
          onSelect={onSelect}
          timeScale={timeScale}
          isPaused={isPaused}
          showHighlight={showHighlights}
          selectedId={selectedId ?? undefined}
          orbitSpeedMultiplier={orbitSpeedOverrides?.[body.id] ?? 1}
        />
      ))}
      {showSunEffects && <SunTourEffects />}
    </>
  );
};
