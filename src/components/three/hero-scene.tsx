"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { Color } from "three";
import { ChibiHero } from "@/components/characters/chibi-hero";
import { cn } from "@/lib/utils";

type HeroSceneProps = {
  mood?: "muted" | "vibrant" | "sunrise";
  showLanding?: boolean;
  className?: string;
};

function isWebGLAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function HeroMesh({ color }: { color: Color }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.3;
    meshRef.current.rotation.x = Math.cos(t * 0.2) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.2, 0]}>
      <icosahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.2) * 0.4;
    camera.position.y = 1.4 + Math.sin(t * 0.3) * 0.15;
    camera.position.z = 2.6;
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export function HeroScene({
  mood = "vibrant",
  showLanding = true,
  className,
}: HeroSceneProps) {
  const hasWindow = typeof window !== "undefined";
  const hasWebGL = hasWindow ? isWebGLAvailable() : false;

  const palette = useMemo(() => {
    switch (mood) {
      case "muted":
        return {
          main: new Color("#C9C3FF"),
          rim: new Color("#F4E8FF"),
        };
      case "sunrise":
        return {
          main: new Color("#FFD6A5"),
          rim: new Color("#FFB7D5"),
        };
      default:
        return {
          main: new Color("#B9B3FF"),
          rim: new Color("#7CFFCB"),
        };
    }
  }, [mood]);

  if (!hasWindow) {
    return null;
  }

  if (!hasWebGL) {
    return <ChibiHero state={showLanding ? "hero" : "idle"} size={200} />;
  }

  return (
    <div className={cn("h-[360px] w-full", className)}>
      <Canvas
        camera={{ position: [0, 1.2, 2.6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} color={palette.rim} />
        <directionalLight position={[3, 4, 2]} intensity={0.9} color={palette.main} />
        <pointLight position={[-3, 2, 2]} intensity={0.6} color={palette.rim} />
        <CameraRig />
        <Float floatIntensity={0.4} rotationIntensity={0.4}>
          <HeroMesh color={palette.main} />
        </Float>
      </Canvas>
    </div>
  );
}
