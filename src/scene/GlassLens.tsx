import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface GlassLensProps {
  pointer: { x: number; y: number };
}

export function GlassLens({ pointer }: GlassLensProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * 0.2;

    // Drifts gently over the inner rim of the hero orb, well away from screen borders
    const targetX = Math.sin(t) * 0.12 - 0.85 + pointer.x * 0.1;
    const targetY = Math.cos(t * 0.5) * 0.12 - 0.2 + pointer.y * 0.1;

    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 2, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 2, delta);

    // Subtle lens tilting
    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, -pointer.y * 0.15, 3, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, pointer.x * 0.15, 3, delta);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.2}>
      <mesh
        ref={meshRef}
        position={[-0.85, -0.2, 0.6]}
        scale={[0.65, 0.65, 0.16]}
      >
        <sphereGeometry args={[0.75, 40, 28]} />
        <MeshTransmissionMaterial
          backside={false}
          samples={6}
          resolution={512}
          transmission={0.98}
          roughness={0.05}
          thickness={0.25}
          ior={1.22}
          chromaticAberration={0.02}
          anisotropy={0.08}
          distortion={0.02}
          distortionScale={0.04}
          temporalDistortion={0.01}
          color="#ffffff"
          attenuationColor="#ffffff"
          attenuationDistance={1.5}
        />
      </mesh>
    </Float>
  );
}
