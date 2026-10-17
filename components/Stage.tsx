"use client";

import dynamic from "next/dynamic";

// three.js only ever runs in the browser
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function Stage() {
  return (
    <div className="canvas-wrap">
      <Scene />
    </div>
  );
}
