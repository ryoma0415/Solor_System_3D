import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export type TourCameraMode = 'idle' | 'overview' | 'moveToBody' | 'followBody';

export interface TourCameraCommand {
  mode: TourCameraMode;
  targetBodyId?: string;
  position?: [number, number, number];
  lookAt?: [number, number, number];
  distance?: number;
  durationMs?: number;
  orbitSpeed?: number;
  offset?: [number, number, number];
  sunFacing?: boolean;
}

/**
 * Camera driver for scripted tour motions.
 * Handles smooth moves, follow, and optional orbiting around a target body.
 */
export const TourCameraDriver: React.FC<{ command: TourCameraCommand }> = ({ command }) => {
  const { camera, scene, controls } = useThree();
  const startPosRef = useRef(new THREE.Vector3());
  const lastOffsetRef = useRef(new THREE.Vector3(1, 0.2, 1));
  const startTimeRef = useRef<number>(performance.now());
  const orbitAngleRef = useRef<number>(0);

  const targetPosition = useMemo(() => {
    if (command.position) return new THREE.Vector3(...command.position);
    return new THREE.Vector3(0, 0, 0);
  }, [command.position]);

  const lookAtPosition = useMemo(() => {
    if (command.lookAt) return new THREE.Vector3(...command.lookAt);
    if (command.targetBodyId) {
      const obj = scene.getObjectByName(command.targetBodyId);
      if (obj) {
        const pos = new THREE.Vector3();
        obj.getWorldPosition(pos);
        return pos;
      }
    }
    return new THREE.Vector3(0, 0, 0);
  }, [command.lookAt, command.targetBodyId, scene]);

  useEffect(() => {
    startPosRef.current.copy(camera.position);
    startTimeRef.current = performance.now();
    if (command.mode === 'followBody' && command.targetBodyId) {
      const obj = scene.getObjectByName(command.targetBodyId);
      if (obj) {
        const pos = new THREE.Vector3();
        obj.getWorldPosition(pos);
        const dir = command.offset ? new THREE.Vector3(...command.offset) : new THREE.Vector3().subVectors(camera.position, pos);
        if (dir.lengthSq() < 1e-4) {
          dir.set(1, 0.2, 1);
        }
        const targetLen = command.distance ?? dir.length();
        dir.setLength(targetLen);
        lastOffsetRef.current.copy(dir);
        orbitAngleRef.current = Math.atan2(dir.z, dir.x);
      }
    }
  }, [camera.position, command, scene]);

  useFrame((state, delta) => {
    const orbitControls = controls as OrbitControlsImpl | undefined;
    const now = performance.now();

    if (command.mode === 'idle') {
      orbitControls?.update();
      return;
    }

    if (command.mode === 'overview') {
      const duration = command.durationMs ?? 1500;
      const t = duration > 0 ? Math.min(1, (now - startTimeRef.current) / duration) : 1;
      camera.position.lerpVectors(startPosRef.current, targetPosition, t);
      orbitControls?.target.lerp(lookAtPosition, 0.08);
      orbitControls?.update();
      return;
    }

    if (command.mode === 'moveToBody' && command.targetBodyId) {
      const obj = scene.getObjectByName(command.targetBodyId);
      if (obj) {
        const target = new THREE.Vector3();
        obj.getWorldPosition(target);
        const distance = command.distance ?? 1.2;
        const baseDir =
          command.sunFacing && target.lengthSq() > 0
            ? target.clone().multiplyScalar(-1).normalize()
            : new THREE.Vector3().subVectors(camera.position, target);
        const dir = command.offset
          ? baseDir.add(new THREE.Vector3(...command.offset))
          : baseDir;
        if (dir.lengthSq() < 1e-4) dir.set(1, 0.2, 1);
        dir.setLength(distance);
        const desired = target.clone().add(dir);
        const duration = command.durationMs ?? 1200;
        const t = duration > 0 ? Math.min(1, (now - startTimeRef.current) / duration) : 1;
        camera.position.lerpVectors(startPosRef.current, desired, t);
        orbitControls?.target.lerp(target, 0.1);
      }
      orbitControls?.update();
      return;
    }

    if (command.mode === 'followBody' && command.targetBodyId) {
      const obj = scene.getObjectByName(command.targetBodyId);
      if (obj) {
        const target = new THREE.Vector3();
        obj.getWorldPosition(target);
        const desiredDistance = command.distance ?? (lastOffsetRef.current.length() || 1.2);
        if (command.orbitSpeed) {
          orbitAngleRef.current += command.orbitSpeed * delta;
          const yOffset = lastOffsetRef.current.y;
          lastOffsetRef.current.set(
            Math.cos(orbitAngleRef.current) * desiredDistance,
            yOffset,
            Math.sin(orbitAngleRef.current) * desiredDistance
          );
        } else if (lastOffsetRef.current.lengthSq() === 0) {
          const base =
            command.sunFacing && target.lengthSq() > 0
              ? target.clone().multiplyScalar(-1).normalize()
              : new THREE.Vector3(1, 0.2, 1);
          const merged = command.offset ? base.add(new THREE.Vector3(...command.offset)) : base;
          merged.setLength(desiredDistance);
          lastOffsetRef.current.copy(merged);
        } else {
          lastOffsetRef.current.setLength(desiredDistance);
        }

        const desired = target.clone().add(lastOffsetRef.current);
        camera.position.lerp(desired, 0.08);
        orbitControls?.target.lerp(target, 0.12);
      }
      orbitControls?.update();
      return;
    }

    orbitControls?.update();
  });

  return null;
};
