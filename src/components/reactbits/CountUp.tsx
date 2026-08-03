"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

export default function CountUp({ to, from = 0, duration = 2.2, suffix = "", decimals = 0 }: CountUpProps) {
  const targetVal = isNaN(Number(to)) ? 0 : Number(to);
  const startVal = isNaN(Number(from)) ? 0 : Number(from);
  const [count, setCount] = useState(targetVal);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    let animationFrameId: number | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries && entries[0] && entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const val = progress * (targetVal - startVal) + startVal;
            setCount(isNaN(val) ? targetVal : val);
            if (progress < 1) {
              animationFrameId = requestAnimationFrame(step);
            }
          };

          animationFrameId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetVal, startVal, duration]);

  const displayNum = typeof count === "number" && !isNaN(count) ? count.toFixed(decimals) : targetVal.toString();

  return (
    <span ref={ref}>
      {displayNum}
      {suffix}
    </span>
  );
}
