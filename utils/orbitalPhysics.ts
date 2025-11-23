import { OrbitalElements } from '../types';
import * as THREE from 'three';

// Constants
const DEG_TO_RAD = Math.PI / 180;

/**
 * Solves Kepler's Equation M = E - e * sin(E) for E (Eccentric Anomaly)
 * using Newton-Raphson iteration.
 */
function solveKepler(meanAnomaly: number, eccentricity: number): number {
  let E = meanAnomaly; // Initial guess
  const tolerance = 1e-6;
  const maxIter = 30;

  for (let i = 0; i < maxIter; i++) {
    const delta = E - eccentricity * Math.sin(E) - meanAnomaly;
    if (Math.abs(delta) < tolerance) break;
    const derivative = 1 - eccentricity * Math.cos(E);
    E = E - delta / derivative;
  }
  return E;
}

/**
 * Calculates the 3D position of a body given its orbital elements and a time offset.
 * Returns a Vector3 where 1 unit = 1 AU.
 */
export function calculateOrbitPosition(
  elements: OrbitalElements,
  periodYears: number | null,
  timeYears: number
): THREE.Vector3 {
  if (!elements.semi_major_axis_au || !periodYears) {
    return new THREE.Vector3(0, 0, 0);
  }

  const a = elements.semi_major_axis_au;
  const e = elements.eccentricity || 0;
  const i = (elements.inclination_deg || 0) * DEG_TO_RAD;
  const Omega = (elements.longitude_of_ascending_node_deg || 0) * DEG_TO_RAD;
  const omega = (elements.argument_of_periapsis_deg || 0) * DEG_TO_RAD;
  // Use initial mean anomaly if provided, else 0. 
  // M = M0 + n * t
  const M0 = (elements.mean_anomaly_deg || 0) * DEG_TO_RAD;
  const n = (2 * Math.PI) / periodYears; // Mean motion in rad/year
  const M = M0 + n * timeYears;

  // 1. Solve for Eccentric Anomaly E
  const E = solveKepler(M, e);

  // 2. Calculate coordinates in the orbital plane (z' = 0)
  // x' = a * (cos E - e)
  // y' = a * sqrt(1 - e^2) * sin E
  const x_prime = a * (Math.cos(E) - e);
  const y_prime = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // 3. Rotate to Heliocentric Ecliptic coordinates
  // We perform 3 rotations:
  // Rz(-Omega) * Rx(-i) * Rz(-omega) is the typical transform to get FROM orbit TO ecliptic
  // Actually, standard formula:
  // x = x'(cos w cos O - sin w sin O cos i) - y'(sin w cos O + cos w sin O cos i)
  // y = x'(cos w sin O + sin w cos O cos i) - y'(sin w sin O - cos w cos O cos i)
  // z = x'(sin w sin i) + y'(cos w sin i)

  const cos_O = Math.cos(Omega);
  const sin_O = Math.sin(Omega);
  const cos_w = Math.cos(omega);
  const sin_w = Math.sin(omega);
  const cos_i = Math.cos(i);
  const sin_i = Math.sin(i);

  const x = x_prime * (cos_w * cos_O - sin_w * sin_O * cos_i) - y_prime * (sin_w * cos_O + cos_w * sin_O * cos_i);
  const y = x_prime * (cos_w * sin_O + sin_w * cos_O * cos_i) - y_prime * (sin_w * sin_O - cos_w * cos_O * cos_i);
  const z = x_prime * (sin_w * sin_i) + y_prime * (cos_w * sin_i);

  // Note: Y is up in Three.js usually, but in astronomical coordinates Z is often 'North'.
  // We will map Astronomical Z to Three.js Y (Up), Astronomical Y to Three.js -Z (Depth).
  // Standard OpenGL: Y is up.
  // Let's map: 
  // Astro X -> Three X
  // Astro Y -> Three Z
  // Astro Z -> Three Y
  
  return new THREE.Vector3(x, z, y);
}

export const PLANET_COLORS: Record<string, string> = {
  sun: '#fdb813',
  mercury: '#A5A5A5',
  venus: '#E3BB76',
  earth: '#22A6B3',
  moon: '#d0d6db',
  iss: '#ffffff',
  phobos: '#887f76',
  deimos: '#9b958d',
  mars: '#D35400',
  jupiter: '#E1DA00',
  io: '#f3d65d',
  europa: '#bfc9dd',
  ganymede: '#9a8773',
  callisto: '#6f6258',
  saturn: '#F4D03F',
  titan: '#d1a754',
  enceladus: '#e9f5ff',
  uranus: '#7DE3F4',
  neptune: '#3498DB',
  triton: '#b2c8d9',
  ceres: '#95A5A6',
  pluto: '#D7BDE2',
  charon: '#c7bfb7',
  haumea: '#BDC3C7',
  makemake: '#E59866',
  eris: '#F2F3F4',
  halley_comet: '#9ed8ff'
};

// Scale factor for visual representation of planets (not orbits)
// Orbits are 1 unit = 1 AU.
// Sun radius is ~0.00465 AU.
export const SIZE_SCALE = 300; // Visual boost while avoiding over-scaling
export const MIN_VISUAL_RADIUS = 0.003; // Floor size so tiny bodies remain visible
