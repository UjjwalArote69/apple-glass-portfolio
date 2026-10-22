import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { IridescentMaterialShader } from '../shaders/iridescentShader';
import type { Theme } from '../hooks/useTheme';

interface IridescentOrbProps {
  pointer: { x: number; y: number };
  theme: Theme;
  warmthFactor?: number;
  scale?: number;
}

export function IridescentOrb({ pointer, theme, warmthFactor = 0, scale = 1.6 }: IridescentOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Shader uniforms
  const uniforms = useMemo(() => {
    return THREE.UniformsUtils.clone(IridescentMaterialShader.uniforms);
  }, []);

  // Update colors based on theme
  useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;

    if (theme === 'night') {
      // Vivid nocturnal palette: Magenta -> Cobalt -> Mint
      gsapColor(u.uColor1.value, '#E23A8C'); // Magenta
      gsapColor(u.uColor2.value, '#3E5BFF'); // Cobalt
      gsapColor(u.uColor3.value, '#9FD9C1'); // Mint
      gsapColor(u.uColor4.value, '#2A1F45'); // Deep luminous core
    } else {
      // Daylight palette: Warm Peach -> Lavender -> Periwinkle -> Milky White
      gsapColor(u.uColor1.value, '#FFD1B3');
      gsapColor(u.uColor2.value, '#D8CCFD');
      gsapColor(u.uColor3.value, '#A9C4FF');
      gsapColor(u.uColor4.value, '#FFF9F5');
    }
  }, [theme]);

  // Frame tick for noise time, cursor lean, and subtle tilt
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Pointer uniform smoothly tracks normalized cursor
      materialRef.current.uniforms.uPointer.value.x = pointer.x;
      materialRef.current.uniforms.uPointer.value.y = pointer.y;
      materialRef.current.uniforms.uWarmthFactor.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uWarmthFactor.value,
        warmthFactor,
        0.05
      );
    }

    if (meshRef.current) {
      // Orb subtly tilts and leans toward pointer with spring-like physics
      const targetRotX = -pointer.y * 0.35;
      const targetRotY = pointer.x * 0.45;

      meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 4, delta);
      meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 4, delta);
    }
  });

  return (
    <Float
      speed={1.6}
      rotationIntensity={0.25}
      floatIntensity={0.45}
      floatingRange={[-0.1, 0.1]}
    >
      <mesh ref={meshRef} scale={scale} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={IridescentMaterialShader.vertexShader}
          fragmentShader={IridescentMaterialShader.fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite
          side={THREE.FrontSide}
        />
      </mesh>
    </Float>
  );
}

// Helper for smooth color lerp
function gsapColor(color: THREE.Color, targetHex: string) {
  const target = new THREE.Color(targetHex);
  color.lerp(target, 0.2);
}
