"use client";

import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import Pot from "./Pot";
import { K, at, sceneTime } from "@/lib/progress";
import { useCssVar } from "@/lib/useCssVar";

function CameraRig() {
  useFrame(({ camera }) => {
    camera.position.y = at(K.cy, sceneTime());
    camera.lookAt(0, -0.15, 0);
  });
  return null;
}

// Procedural studio: dark room with soft boxes, so the steel gets crisp highlights.
function Studio() {
  const accent = useCssVar("--accent", "#C0391B");
  return (
    <Environment resolution={256} frames={1} key={accent}>
      <color attach="background" args={["#2e211b"]} />
      <Lightformer form="rect" intensity={4} color="#fff4e6" position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={2} color="#ffffff" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 1.4, 1]} />
      <Lightformer form="rect" intensity={1.4} color="#fff1e0" position={[5, 0.5, -1]} rotation-y={-Math.PI / 2} scale={[8, 0.8, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, 1, 5]} scale={[6, 0.5, 1]} />
      <Lightformer form="ring" intensity={2.2} color={accent} position={[3, 2.5, 3]} scale={1.6} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={0.9} color="#f0e3cf" position={[0, -3, 2]} rotation-x={-Math.PI / 2} scale={[10, 6, 1]} />
    </Environment>
  );
}

export default function Scene() {
  const shadow = useCssVar("--shadow", "#3B160C");
  // Listen on the whole stage so the pot follows the mouse even over the overlay
  const [source] = useState(() => document.querySelector<HTMLElement>(".stage") ?? undefined);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      eventSource={source}
      eventPrefix="client"
    >
      <Studio />
      <CameraRig />
      <Pot variant="main" />
      <Pot variant="left" />
      <Pot variant="right" />
      <ContactShadows position={[0, -0.82, 0]} scale={12} far={3} blur={2.4} opacity={0.5} resolution={512} color={shadow} />
    </Canvas>
  );
}
