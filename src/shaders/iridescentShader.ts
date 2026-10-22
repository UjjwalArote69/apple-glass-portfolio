import * as THREE from 'three';
import { simplexNoise3D } from './noiseGlsl';

export const IridescentMaterialShader = {
  uniforms: {
    uTime: { value: 0 },
    uDisplacement: { value: 0.12 },
    uSpeed: { value: 0.45 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uColor1: { value: new THREE.Color('#FFD1B3') }, // Peach
    uColor2: { value: new THREE.Color('#D8CCFD') }, // Lavender
    uColor3: { value: new THREE.Color('#A9C4FF') }, // Periwinkle
    uColor4: { value: new THREE.Color('#FFF5EE') }, // Milky White
    uFresnelPower: { value: 2.2 },
    uRoughness: { value: 0.25 },
    uMilkyGlow: { value: 0.4 },
    uWarmthFactor: { value: 0.0 }, // Can be driven by scroll
  },

  vertexShader: `
    uniform float uTime;
    uniform float uDisplacement;
    uniform float uSpeed;
    uniform vec2 uPointer;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vNoise;

    ${simplexNoise3D}

    void main() {
      vNormal = normalize(normalMatrix * normal);
      
      // Calculate organic breathing displacement
      vec3 pos = position;
      float noiseVal = snoise(pos * 1.5 + vec3(uTime * uSpeed * 0.4));
      float slowPulse = sin(uTime * 0.8) * 0.04;
      
      // Reactive tilt displacement slightly nudged by pointer
      vec3 displaced = pos + normal * (noiseVal * uDisplacement + slowPulse);
      vNoise = noiseVal;

      vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
      vWorldPosition = worldPos.xyz;

      vec4 mvPosition = viewMatrix * worldPos;
      vViewPosition = -mvPosition.xyz;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec2 uPointer;
    uniform vec3 uColor1; // Peach
    uniform vec3 uColor2; // Lavender
    uniform vec3 uColor3; // Periwinkle
    uniform vec3 uColor4; // Milky White
    uniform float uFresnelPower;
    uniform float uMilkyGlow;
    uniform float uWarmthFactor;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vNoise;

    void main() {
      vec3 N = normalize(vNormal);
      vec3 V = normalize(vViewPosition);

      // Dynamic light source influenced by cursor
      vec3 lightPos = normalize(vec3(uPointer.x * 2.0 + 1.2, uPointer.y * 2.0 + 1.5, 2.5));
      vec3 H = normalize(lightPos + V);

      // Fresnel calculation for rim glow
      float NdotV = max(dot(N, V), 0.0);
      float fresnel = pow(1.0 - NdotV, uFresnelPower);
      fresnel = clamp(fresnel, 0.0, 1.0);

      // Iridescent thin-film ramp (peach -> lavender -> periwinkle)
      float rampT = clamp(fresnel + vNoise * 0.15, 0.0, 1.0);
      
      vec3 colorGrad;
      if (rampT < 0.45) {
        colorGrad = mix(uColor1, uColor2, rampT / 0.45);
      } else if (rampT < 0.85) {
        colorGrad = mix(uColor2, uColor3, (rampT - 0.45) / 0.4);
      } else {
        colorGrad = mix(uColor3, uColor4, (rampT - 0.85) / 0.15);
      }

      // Warmth shift factor (driven by scroll)
      vec3 warmColor = mix(colorGrad, vec3(1.0, 0.72, 0.52), uWarmthFactor * 0.4);

      // Specular Blinn-Phong highlight
      float NdotH = max(dot(N, H), 0.0);
      float specular = pow(NdotH, 48.0) * 0.85;

      // Milky inner pearlescence
      vec3 innerGlow = uColor4 * (pow(NdotV, 1.8) * uMilkyGlow);

      // Composite final pearly apple aesthetic
      vec3 finalColor = warmColor + innerGlow + vec3(specular);

      // Subtle translucent edge falloff
      float alpha = 0.94 + fresnel * 0.06;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};
