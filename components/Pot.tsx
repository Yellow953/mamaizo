"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { K, at, clamp, progress, sceneTime } from "@/lib/progress";
import { useCssVar } from "@/lib/useCssVar";

type Variant = "main" | "left" | "right";

// Pot proportions per variant (radius, body height). The base always sits at local y = -0.55.
const DIMS: Record<Variant, { r: number; h: number }> = {
  main: { r: 0.82, h: 0.9 },
  left: { r: 0.66, h: 1.2 }, // stock pot
  right: { r: 0.95, h: 0.55 }, // casserole
};

const BASE = -0.55;
// Keeps the base of the pot on the floor where the contact shadow is.
export const floorY = (scale: number) => -0.82 + 0.55 * scale;

const v = (x: number, y: number) => new THREE.Vector2(x, y);

function bodyProfile(r: number, h: number) {
  const y0 = BASE;
  const y1 = BASE + h;
  const wall = 0.03;
  return [
    // outside, from the center of the base out and up
    v(0, y0),
    v(r * 0.75, y0),
    v(r * 0.93, y0 + 0.012),
    v(r * 0.985, y0 + 0.045),
    v(r, y0 + 0.11),
    v(r, y1 - 0.05),
    // rolled rim
    v(r + 0.018, y1 - 0.02),
    v(r + 0.024, y1),
    v(r + 0.01, y1 + 0.016),
    v(r - wall * 0.5, y1 + 0.01),
    // inside, back down to the center
    v(r - wall, y1 - 0.02),
    v(r - wall, y0 + 0.13),
    v(r * 0.93 - wall, y0 + 0.06),
    v(r * 0.7, y0 + 0.045),
    v(0, y0 + 0.045),
  ];
}

function lidProfile(r: number) {
  const dome = 0.08 + r * 0.14;
  const pts = [
    v(0, dome + 0.04),
  ];
  for (let i = 1; i <= 14; i++) {
    const a = (Math.PI / 2) * (1 - i / 14);
    pts.push(v((r - 0.02) * Math.cos(a), 0.04 + dome * Math.sin(a)));
  }
  // rim that rests on the pot, then the flange that drops inside it
  pts.push(v(r + 0.03, 0.02), v(r + 0.03, 0.0), v(r - 0.035, 0.0), v(r - 0.045, -0.04));
  return { pts, top: dome + 0.04 };
}

function steamTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const STEAM = 90;

// Small seeded PRNG so the steam layout is stable across renders
function rand(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Steam({ r, top, lift }: { r: number; top: number; lift: React.RefObject<number> }) {
  const color = useCssVar("--steam", "#ffffff");
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const tex = useMemo(() => steamTexture(), []);
  const { positions, seeds } = useMemo(() => {
    const random = rand(7);
    const seeds = Array.from({ length: STEAM }, () => ({
      a: random() * Math.PI * 2,
      d: Math.sqrt(random()) * r * 0.65,
      speed: 0.12 + random() * 0.16,
      phase: random(),
    }));
    return { positions: new Float32Array(STEAM * 3), seeds };
  }, [r]);
  const time = useRef(0);

  useFrame((_, dt) => {
    const l = lift.current;
    if (!points.current || !mat.current) return;
    points.current.visible = l > 0.01;
    mat.current.opacity = l * 0.5;
    if (!points.current.visible) return;
    if (!progress.reduced) time.current += dt;
    seeds.forEach((s, i) => {
      const k = (s.phase + time.current * s.speed) % 1;
      const drift = Math.sin(time.current * 0.8 + s.a * 3) * 0.08 * k;
      positions[i * 3] = Math.cos(s.a) * s.d * (1 - k * 0.3) + drift;
      positions[i * 3 + 1] = top + k * 1.1 * l;
      positions[i * 3 + 2] = Math.sin(s.a) * s.d * (1 - k * 0.3);
    });
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        map={tex}
        color={color}
        size={0.22}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Handle({ r, y, side }: { r: number; y: number; side: 1 | -1 }) {
  // Half torus lying flat-ish, ends meeting the wall
  return (
    <group rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
      <mesh position={[r - 0.02, y, 0]} rotation={[Math.PI / 2 - 0.25, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.15, 0.032, 16, 40, Math.PI]} />
        <meshStandardMaterial color="#e6e3df" metalness={1} roughness={0.22} />
      </mesh>
    </group>
  );
}

export default function Pot({ variant = "main" }: { variant?: Variant }) {
  const { r, h } = DIMS[variant];
  const group = useRef<THREE.Group>(null);
  const lidGroup = useRef<THREE.Group>(null);
  const follow = useRef({ x: 0, y: 0 });
  const lift = useRef(0);

  const body = useMemo(() => new THREE.LatheGeometry(bodyProfile(r, h), 96), [r, h]);
  const lid = useMemo(() => {
    const { pts, top } = lidProfile(r);
    return { geo: new THREE.LatheGeometry(pts, 96), top };
  }, [r]);
  const rimY = BASE + h;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = sceneTime();
    const narrow = state.size.width < 700;
    // Shrink the whole set on narrow viewports so it fits the width
    const fit = clamp(state.viewport.width / 5.2, 0.45, 1);

    if (!progress.reduced) {
      const k = 1 - Math.exp(-dt * 4);
      follow.current.x += (state.pointer.x - follow.current.x) * k;
      follow.current.y += (state.pointer.y - follow.current.y) * k;
    }
    const fx = follow.current.x;
    const fy = follow.current.y;

    if (variant === "main") {
      const s = at(K.sc, t) * fit;
      g.scale.setScalar(s);
      g.position.set(narrow ? 0 : at(K.px, t) * fit, floorY(s), 0);
      g.rotation.set(at(K.rx, t) - fy * 0.12, at(K.ry, t) + fx * 0.35, 0);
      lift.current = at(K.lift, t);
    } else {
      const shown = at(K.rng, t);
      g.visible = shown > 0.01;
      if (!g.visible) return;
      const side = variant === "left" ? -1 : 1;
      const s = (variant === "left" ? 0.85 : 0.8) * fit * (0.5 + 0.5 * shown);
      const x = Math.min(2.15, state.viewport.width * 0.32);
      g.scale.setScalar(s);
      g.position.set(side * (x + (1 - shown) * 1.6), floorY(s), -0.3);
      g.rotation.set(0.12 - fy * 0.08, t * 0.9 + side * 0.6 + fx * 0.25, 0);
      lift.current = 0;
    }

    const lg = lidGroup.current;
    if (lg) {
      const l = lift.current;
      lg.position.set(0, rimY + l * 0.4, l * 0.1);
      lg.rotation.set(l * 0.35, l * 0.7, 0);
    }
  });

  return (
    <group ref={group} visible={variant === "main"}>
      <mesh geometry={body}>
        <meshStandardMaterial color="#e6e3df" metalness={1} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <Handle r={r} y={rimY - 0.17} side={1} />
      <Handle r={r} y={rimY - 0.17} side={-1} />

      <group ref={lidGroup} position={[0, rimY, 0]}>
        <mesh geometry={lid.geo}>
          <meshStandardMaterial color="#e6e3df" metalness={1} roughness={0.18} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, lid.top + 0.03, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.06, 24]} />
          <meshStandardMaterial color="#141010" roughness={0.5} />
        </mesh>
        <mesh position={[0, lid.top + 0.08, 0]} scale={[1, 0.55, 1]}>
          <sphereGeometry args={[0.11, 32, 16]} />
          <meshStandardMaterial color="#141010" roughness={0.45} />
        </mesh>
      </group>

      {variant === "main" && <Steam r={r} top={rimY} lift={lift} />}
    </group>
  );
}
