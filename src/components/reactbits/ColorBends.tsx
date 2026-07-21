"use client";

import { useEffect, useRef } from "react";

interface ColorBendsProps {
  color?: string;
  speed?: number;
  frequency?: number;
  noise?: number;
  bandWidth?: number;
  rotation?: number;
  fadeTop?: number;
  iterations?: number;
  intensity?: number;
  className?: string;
}

export default function ColorBends({
  color = "#C29B57",
  speed = 0.15,
  frequency = 0.8,
  noise = 0.1,
  bandWidth = 0.16,
  rotation = 90,
  fadeTop = 0.8,
  iterations = 1,
  intensity = 1.2,
  className = "",
}: ColorBendsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Parse hex color to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    let time = 0;
    const rotRad = (rotation * Math.PI) / 180;

    const animate = () => {
      time += speed * 0.01;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < iterations; i++) {
        for (let y = 0; y < height; y += 2) {
          const normalY = y / height;
          const fade = normalY < fadeTop ? 1 : 1 - (normalY - fadeTop) / (1 - fadeTop);

          // Rotate coordinates
          const rotX = Math.cos(rotRad) * 0.5 + Math.sin(rotRad) * normalY;
          const rotY = -Math.sin(rotRad) * 0.5 + Math.cos(rotRad) * normalY;

          // Wave calculation
          const wave = Math.sin((rotY + time + i * 0.5) * frequency * Math.PI * 2);
          const noiseVal = Math.sin((rotX + time * 0.7) * 13.0 + normalY * 7.0) * noise;
          const band = Math.exp(-Math.pow((wave + noiseVal) / bandWidth, 2));

          const alpha = band * intensity * fade * 0.3;

          if (alpha > 0.01) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fillRect(0, y, width, 2);
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, speed, frequency, noise, bandWidth, rotation, fadeTop, iterations, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
}
