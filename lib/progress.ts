// Shared scroll store. ScrollDriver writes it, Scene/Pot/Overlay read it every frame.
export const progress = {
  target: 0,
  current: 0,
  reduced: false,
};

export const SCENE_COUNT = 5;

// One value per scene: 0 hero, 1 cook slow, 2 lift the lid, 3 the range, 4 order.
export const K = {
  ry: [0.5, 2.9, 3.7, 5.2, 6.78], // pot rotation Y
  rx: [0.1, 0.28, 0.38, 0.12, 0.08], // pot tilt X
  px: [0, 0.95, 0, 0, 0], // pot x offset
  sc: [1.45, 1.4, 1.5, 1.05, 1.35], // pot scale
  lift: [0, 0, 1, 0, 0], // lid lift
  cy: [0, 0.15, 1.1, 0.2, 0], // camera y
  rng: [0, 0, 0, 1, 0], // side pots visible
};

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smooth = (x: number) => x * x * (3 - 2 * x);

// Interpolate a keyframe array at scene time t (0..SCENE_COUNT-1) with smoothstep.
export function at(arr: number[], t: number) {
  const c = clamp(t, 0, arr.length - 1);
  const i = Math.min(Math.floor(c), arr.length - 2);
  return arr[i] + (arr[i + 1] - arr[i]) * smooth(c - i);
}

// How present scene i is at time t: 1 on the scene, fading out before the midpoint.
export const weight = (i: number, t: number) => clamp(1 - Math.abs(t - i) * 1.8);

export const sceneTime = () => progress.current * (SCENE_COUNT - 1);
