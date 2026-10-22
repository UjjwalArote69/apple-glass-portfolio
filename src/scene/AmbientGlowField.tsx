import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Theme } from '../hooks/useTheme';

interface AmbientGlowFieldProps {
  theme: Theme;
}

// Ultra-smooth radial falloff shader (no hard edges)
const radialGlowShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform float uOpacity;

    void main() {
      float dist = length(vUv - vec2(0.5)) * 2.0;
      if (dist > 1.0) discard;
      
      // Pure gaussian-like optical falloff
      float alpha = smoothstep(1.0, 0.05, dist);
      alpha = pow(alpha, 2.2) * uOpacity;

      gl_FragColor = vec4(uColor, alpha);
    }
  `
};

export function AmbientGlowField({ theme }: AmbientGlowFieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mesh1Ref = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);
  const mesh3Ref = useRef<THREE.Mesh>(null);

  const colors = theme === 'night'
    ? {
        c1: new THREE.Color('#E23A8C'), // magenta
        c2: new THREE.Color('#3E5BFF'), // cobalt
        c3: new THREE.Color('#9FD9C1'), // mint
        op: 0.38
      }
    : {
        c1: new THREE.Color('#FFC9A3'), // peach
        c2: new THREE.Color('#C9C3FA'), // lavender
        c3: new THREE.Color('#A9C4FF'), // periwinkle
        op: 0.45
      };

  const mat1 = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: radialGlowShader.vertexShader,
    fragmentShader: radialGlowShader.fragmentShader,
    uniforms: {
      uColor: { value: colors.c1 },
      uOpacity: { value: colors.op },
    },
    transparent: true,
    depthWrite: false,
    blending: theme === 'night' ? THREE.AdditiveBlending : THREE.NormalBlending,
  }), [colors.c1, colors.op, theme]);

  const mat2 = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: radialGlowShader.vertexShader,
    fragmentShader: radialGlowShader.fragmentShader,
    uniforms: {
      uColor: { value: colors.c2 },
      uOpacity: { value: colors.op * 0.85 },
    },
    transparent: true,
    depthWrite: false,
    blending: theme === 'night' ? THREE.AdditiveBlending : THREE.NormalBlending,
  }), [colors.c2, colors.op, theme]);

  const mat3 = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: radialGlowShader.vertexShader,
    fragmentShader: radialGlowShader.fragmentShader,
    uniforms: {
      uColor: { value: colors.c3 },
      uOpacity: { value: colors.op * 0.75 },
    },
    transparent: true,
    depthWrite: false,
    blending: theme === 'night' ? THREE.AdditiveBlending : THREE.NormalBlending,
  }), [colors.c3, colors.op, theme]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.12;
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.08;
    }

    if (mesh1Ref.current) {
      mesh1Ref.current.position.x = Math.sin(t * 0.8) * 1.8 + 1.2;
      mesh1Ref.current.position.y = Math.cos(t * 0.6) * 1.4 + 0.4;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.position.x = Math.sin(t * 0.7 + 2.0) * 2.0 - 1.0;
      mesh2Ref.current.position.y = Math.cos(t * 0.9 + 1.5) * 1.5 - 0.6;
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.position.x = Math.cos(t * 0.5 + 4.0) * 2.2;
      mesh3Ref.current.position.y = Math.sin(t * 0.7 + 3.0) * 1.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -3.5]}>
      {/* Peach soft radial glow plane */}
      <mesh ref={mesh1Ref} position={[1.5, 0.8, 0]} material={mat1}>
        <planeGeometry args={[7, 7]} />
      </mesh>

      {/* Lavender soft radial glow plane */}
      <mesh ref={mesh2Ref} position={[-1.5, -0.8, -0.2]} material={mat2}>
        <planeGeometry args={[8, 8]} />
      </mesh>

      {/* Periwinkle soft radial glow plane */}
      <mesh ref={mesh3Ref} position={[0.2, 1.5, -0.1]} material={mat3}>
        <planeGeometry args={[6.5, 6.5]} />
      </mesh>
    </group>
  );
}
