import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBodyData } from '../types';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { MIN_VISUAL_RADIUS, SIZE_SCALE } from '../utils/orbitalPhysics';

interface CameraControllerProps {
  selectedBody: CelestialBodyData | null;
}

export const CameraController: React.FC<CameraControllerProps> = ({ selectedBody }) => {
  const { camera, scene, controls } = useThree();
  const currentTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(false);

  // Effect to trigger transition start when selection changes
  useEffect(() => {
    if (selectedBody) {
      isTransitioning.current = true;
    }
  }, [selectedBody]);

  useFrame((state, delta) => {
    const orbitControls = controls as unknown as OrbitControlsImpl;
    
    if (!orbitControls) return;

    if (selectedBody) {
      const bodyObject = scene.getObjectByName(selectedBody.id);

      if (bodyObject) {
        const targetPos = bodyObject.position;
        
        // 1. Smoothly update the controls target to follow the planet (Tracking)
        // We perform a lerp (linear interpolation) to make the tracking smooth
        orbitControls.target.lerp(targetPos, 0.1);
        
        // 2. Handle the initial "Fly to" zoom
        if (isTransitioning.current) {
            // Calculate appropriate zoom distance based on physical size
            // We use SIZE_SCALE to estimate visual size.
            // Default orbital view is far, but for close up we want to be near the surface.
            const radiusKm = selectedBody.physical.mean_radius_km ?? selectedBody.physical.equatorial_radius_km ?? 0;
            const radiusAU = radiusKm / 149597870.7;
            // Determine a nice offset. Small planets need to be closer.
            // The SIZE_SCALE logic in CelestialBody: visualRadius = Math.max(radiusAU * SIZE_SCALE, MIN_VISUAL_RADIUS);
            const visualRadius = Math.max(radiusAU * SIZE_SCALE, MIN_VISUAL_RADIUS);
            
            // Calculate an offset position relative to the planet
            // We keep the current camera angle but move it closer
            const offsetDirection = new THREE.Vector3()
                .subVectors(camera.position, targetPos)
                .normalize();
            
            // Distance multiplier tuned for smaller rendered bodies (unified across all bodies)
            const zoomMultiplier = selectedBody.id === 'sun' ? 1.2 : 2.5;
            const minZoom = 0.08;
            const zoomDist = Math.max(visualRadius * zoomMultiplier, minZoom);
            
            const desiredCameraPos = targetPos.clone().add(offsetDirection.multiplyScalar(zoomDist));
            
            // Lerp camera position
            camera.position.lerp(desiredCameraPos, 0.05);
            
            // Stop transitioning when we are close enough
            if (camera.position.distanceTo(desiredCameraPos) < 0.1) {
                isTransitioning.current = false;
            }
        }
      }
    }
    
    orbitControls.update();
  });

  return null;
};
