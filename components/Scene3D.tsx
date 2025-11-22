import React from 'react';
import { CelestialBody } from './CelestialBody';
import { SOLAR_SYSTEM_DATA } from '../data';
import { CelestialBodyData } from '../types';

interface Scene3DProps {
  onSelect: (body: CelestialBodyData) => void;
  timeScale: number;
  isPaused: boolean;
  showHighlights?: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({ onSelect, timeScale, isPaused, showHighlights = false }) => {
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
        />
      ))}
    </>
  );
};