'use client';

import { cn } from '@/lib/utils';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

const DOT_MATRIX_FRAGMENT = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_colors[6];
uniform float u_opacities[10];
uniform float u_total_size;
uniform float u_dot_size;
in vec2 fragCoord;
out vec4 fragColor;
void main() {
  vec2 uv = fragCoord / u_resolution;
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  uv += 0.5;
  vec2 grid = uv * u_total_size;
  vec2 id = floor(grid);
  vec2 gv = fract(grid) - 0.5;
  float dist = length(gv);
  float size = (u_dot_size / u_resolution.x) * 2.0;
  float d = smoothstep(size, size * 0.5, dist);
  float t = u_time * 0.4 + id.x * 0.2 + id.y * 0.2;
  int idx = int(mod(floor(t), 10.0));
  float opacity = u_opacities[idx];
  vec3 col = u_colors[0];
  fragColor = vec4(col, d * opacity);
}
`;

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

function ShaderMaterialComp({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}) {
  const { size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) return;
    lastFrameTime = timestamp;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (material?.uniforms?.u_time) material.uniforms.u_time.value = timestamp;
  });

  const preparedUniforms = useMemo(() => {
    const u: Record<string, { value: unknown }> = {};
    for (const name in uniforms) {
      const uniform = uniforms[name];
      switch (uniform.type) {
        case 'uniform1f':
          u[name] = { value: uniform.value as number };
          break;
        case 'uniform1fv':
          u[name] = { value: uniform.value as number[] };
          break;
        case 'uniform3fv':
          u[name] = {
            value: (uniform.value as number[][]).map((v) =>
              new THREE.Vector3().fromArray(v)
            ),
          };
          break;
        case 'uniform2f':
          u[name] = {
            value: new THREE.Vector2().fromArray(uniform.value as number[]),
          };
          break;
        default:
          break;
      }
    }
    u.u_time = { value: 0 };
    u.u_resolution = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return u;
  }, [uniforms, size.width, size.height]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        out vec2 fragCoord;
        void main() {
          fragCoord = (position.xy + 1.0) * 0.5;
          fragCoord.y = 1.0 - fragCoord.y;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: source,
      uniforms: preparedUniforms,
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      transparent: true,
      depthWrite: false,
    });
  }, [source, preparedUniforms]);

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

function DotMatrix({
  colors = [[59, 130, 246]],
  opacities = [0.04, 0.04, 0.04, 0.05, 0.05, 0.08, 0.08, 0.1, 0.12, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = DOT_MATRIX_FRAGMENT,
}: {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
}) {
  const colorsArray = useMemo(() => {
    if (colors.length >= 3)
      return [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    if (colors.length === 2)
      return [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    return Array(6).fill(colors[0]);
  }, [colors]);

  const uniforms = useMemo(
    () => ({
      u_colors: {
        value: colorsArray.map((c) => [c[0] / 255, c[1] / 255, c[2] / 255]),
        type: 'uniform3fv',
      },
      u_opacities: { value: opacities, type: 'uniform1fv' as const },
      u_total_size: { value: totalSize, type: 'uniform1f' as const },
      u_dot_size: { value: dotSize, type: 'uniform1f' as const },
    }),
    [colorsArray, opacities, totalSize, dotSize]
  );

  return (
    <ShaderMaterialComp source={shader} uniforms={uniforms} maxFps={45} />
  );
}

export interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}

export function CanvasRevealEffect({
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[59, 130, 246]],
  containerClassName,
  dotSize = 2,
  showGradient = true,
}: CanvasRevealEffectProps) {
  return (
    <div className={cn('absolute inset-0 h-full w-full overflow-hidden rounded-[var(--radius-card)]', containerClassName)}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        className="absolute inset-0 h-full w-full"
        gl={{ alpha: true, antialias: false }}
      >
        <DotMatrix colors={colors} opacities={opacities} dotSize={dotSize} />
      </Canvas>
      {showGradient && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, var(--accent) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
}
