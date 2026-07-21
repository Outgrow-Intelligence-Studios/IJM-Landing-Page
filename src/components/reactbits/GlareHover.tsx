"use client";

import React, { useRef, useState } from "react";

interface GlareHoverProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlareHover({ children, className = "" }: GlareHoverProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const angleX = (yc - y) / 10; // sensitivity
    const angleY = (x - xc) / 10;

    setStyle({
      transform: `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.01, 1.01, 1.01)`,
      transition: "none",
    });

    // Dynamic Glare effect position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle({
      opacity: 0.15,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "all 0.5s ease",
    });
    setGlareStyle({
      opacity: 0,
      transition: "all 0.5s ease"
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative transition-transform ${className}`}
    >
      <div 
        className="absolute inset-0 pointer-events-none z-10" 
        style={glareStyle} 
      />
      {children}
    </div>
  );
}
