"use client";

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Desert() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(600, 600, 200, 200);
    // Displace vertices to mimic dunes
    const position = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const n = simplex2(x * 0.02, y * 0.02) * 3 + simplex2(x * 0.06, y * 0.06) * 1;
      position.setZ(i, n);
    }
    position.needsUpdate = true;
    geo.computeVertexNormals();
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d4b483'),
    roughness: 0.95,
    metalness: 0.0,
  }), []);

  useFrame((_, delta) => {
    // subtle shimmering heat haze via vertex colors or normal perturbation could be added
    // keep static for performance
  });

  return (
    <mesh geometry={geometry} material={material} receiveShadow />
  );
}

// Simplex-like noise (cheap hash-based pseudo noise)
function simplex2(x: number, y: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}
