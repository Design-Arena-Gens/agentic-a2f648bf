"use client";

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function v3(x: number, y: number, z: number) { return new THREE.Vector3(x, y, z); }
function vlerp(a: THREE.Vector3, b: THREE.Vector3, t: number) { return a.clone().lerp(b, t); }

export function CameraDirector() {
  const { camera } = useThree();
  const target = new THREE.Vector3();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const T = Math.min(15, t); // play once up to 15s

    // Convoy reference path (approximate positions)
    const speed = 6;
    const z1 = -T * speed;
    const spacing = 10;
    const car1 = v3(0, 0.8, z1);
    const car2 = v3(-4, 0.8, z1 - spacing);
    const car3 = v3(4, 0.8, z1 - spacing * 2);
    const convoyCenter = car1.clone().add(car2).add(car3).multiplyScalar(1/3);

    let camPos = camera.position.clone();
    let look = convoyCenter.clone();

    // 0-3s: dolly-in + 360 around car1 nose -> low rear chase
    if (T < 3) {
      const s = T / 3;
      const angle = s * Math.PI * 2; // 360 deg
      const radius = lerp(8, 3.5, smoothstep(0, 1, s));
      const offset = new THREE.Vector3(Math.sin(angle) * radius, lerp(2.0, 1.2, s), Math.cos(angle) * radius * 0.6);
      camPos = car1.clone().add(offset);
      look = car1.clone().add(v3(0, 0.5, -1));
    }
    // 3-6s: low-altitude skim past car2 side
    else if (T < 6) {
      const s = (T - 3) / 3;
      const start = car2.clone().add(v3(-6, 1.2, 6));
      const end = car2.clone().add(v3(-1.5, 1.2, -2));
      camPos = vlerp(start, end, smoothstep(0, 1, s));
      look = car2.clone().add(v3(0, 0.5, 0));
    }
    // 6-9s: swoop under car3 chassis then pull up
    else if (T < 9) {
      const s = (T - 6) / 3;
      const start = car3.clone().add(v3(0, 1.0, 6));
      const mid = car3.clone().add(v3(0, 0.35, 0)); // underbody pass
      const end = car3.clone().add(v3(0, 5.0, -6)); // immediate pull up
      if (s < 0.5) camPos = vlerp(start, mid, smoothstep(0, 1, s * 2));
      else camPos = vlerp(mid, end, smoothstep(0, 1, (s - 0.5) * 2));
      look = car3.clone();
    }
    // 9-11s: explosive climb and zoom out
    else if (T < 11) {
      const s = (T - 9) / 2;
      const start = v3(convoyCenter.x, 5, convoyCenter.z - 6);
      const end = v3(convoyCenter.x, 60, convoyCenter.z - 60);
      camPos = vlerp(start, end, smoothstep(0, 1, s));
      look = convoyCenter.clone();
    }
    // 11-13s: stable high-altitude top-down slight tilt
    else if (T < 13) {
      const s = (T - 11) / 2;
      const base = v3(convoyCenter.x, 65, convoyCenter.z - 80);
      const drift = v3(2 * s, 0, -6 * s);
      camPos = base.add(drift);
      look = convoyCenter.clone();
    }
    // 13-15s: slow lateral drift to wide serene desert panorama
    else {
      const s = (T - 13) / 2;
      const start = v3(convoyCenter.x + 0, 70, convoyCenter.z - 90);
      const end = v3(convoyCenter.x + 60, 70, convoyCenter.z - 120);
      camPos = vlerp(start, end, smoothstep(0, 1, s));
      look = convoyCenter.clone().add(v3(0, -10, 0));
    }

    camera.position.copy(camPos);
    target.copy(look);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  });

  return null;
}
