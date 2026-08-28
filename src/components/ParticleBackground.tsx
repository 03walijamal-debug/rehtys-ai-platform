"use client";

import { useMemo } from "react";
import Particles from "@tsparticles/react";

export function ParticleBackground() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: false, zIndex: 0 },
      fpsLimit: 30,
      particles: {
        number: { value: 50, density: { enable: true, width: 1200, height: 800 } },
        color: { value: "#00E5FF" },
        opacity: { value: 0.15, animation: { enable: true, speed: 0.5, minimumValue: 0.05 } },
        size: { value: { min: 1, max: 2.5 } },
        move: { enable: true, speed: 0.4, direction: "none" as const, outModes: { default: "out" as const } },
        links: { enable: true, distance: 150, color: "#00E5FF", opacity: 0.06, width: 1 },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Particles id="rehtys-particles" options={options} className="absolute inset-0" />
    </div>
  );
}
