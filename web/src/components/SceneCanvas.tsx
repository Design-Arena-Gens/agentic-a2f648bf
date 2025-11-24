"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { Desert } from './desert/Desert';
import { Convoy } from './desert/Convoy';
import { CameraDirector } from './desert/CameraDirector';

export default function SceneCanvas() {
  return (
    <Canvas camera={{ fov: 60, position: [0, 3, 12] }} shadows dpr={[1, 2]}>
      <color attach="background" args={[0.03, 0.03, 0.03]} />
      <hemisphereLight intensity={0.75} color={0xffecc4} groundColor={0x223344} />
      <directionalLight
        position={[30, 50, -20]}
        castShadow
        intensity={2.0}
        color={0xfff6d5}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Suspense fallback={null}>
        <Desert />
        <Convoy />
        <CameraDirector />
        <Environment preset="sunset" />
      </Suspense>

      <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI * 0.49} />
      <Stars radius={200} depth={50} count={2000} factor={4} fade speed={0.2} />
    </Canvas>
  );
}
