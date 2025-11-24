"use client";

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
      <meshStandardMaterial color="#222" roughness={0.6} />
    </mesh>
  );
}

function Car({ color = '#c6452d' }: { color?: string }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[2.4, 0.8, 4.2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.7, -0.4]} castShadow>
        <boxGeometry args={[2.0, 0.6, 2.6]} />
        <meshStandardMaterial color={new THREE.Color(color).offsetHSL(0, -0.2, 0.1)} />
      </mesh>
      <Wheel position={[-0.9, -0.4, 1.5]} />
      <Wheel position={[0.9, -0.4, 1.5]} />
      <Wheel position={[-0.9, -0.4, -1.5]} />
      <Wheel position={[0.9, -0.4, -1.5]} />
    </group>
  );
}

export function Convoy() {
  const car1 = useRef<THREE.Group>(null!);
  const car2 = useRef<THREE.Group>(null!);
  const car3 = useRef<THREE.Group>(null!);

  const startZ = 0;
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = 6; // m/s visual speed across desert
    const z1 = startZ - t * speed;
    const spacing = 10;
    const wobble = (amp: number) => Math.sin(t * 2.3 + amp) * 0.2;
    if (car1.current) car1.current.position.set(0 + wobble(0), 0.6, z1);
    if (car2.current) car2.current.position.set(-4 + wobble(1), 0.6, z1 - spacing);
    if (car3.current) car3.current.position.set(4 + wobble(2), 0.6, z1 - spacing * 2);
  });

  const colors = useMemo(() => ['#c6452d', '#2d6cc6', '#2dc65a'], []);

  return (
    <group>
      <group ref={car1}><Car color={colors[0]} /></group>
      <group ref={car2}><Car color={colors[1]} /></group>
      <group ref={car3}><Car color={colors[2]} /></group>
    </group>
  );
}
