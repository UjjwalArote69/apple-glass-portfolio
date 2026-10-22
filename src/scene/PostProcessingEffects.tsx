import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import type { Theme } from '../hooks/useTheme';

interface PostProcessingEffectsProps {
  theme: Theme;
}

export function PostProcessingEffects({ theme }: PostProcessingEffectsProps) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={theme === 'night' ? 0.72 : 0.88}
        luminanceSmoothing={0.4}
        intensity={theme === 'night' ? 0.6 : 0.35}
        blendFunction={BlendFunction.SCREEN}
      />
      <Noise
        opacity={0.02}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
}
