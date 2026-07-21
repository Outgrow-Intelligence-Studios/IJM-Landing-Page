"use client";

export default function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      <div 
        className="absolute -top-[20%] -left-[20%] w-[100%] h-[100%] filter blur-[120px] animate-pulse"
        style={{
          background: "radial-gradient(circle at center, rgba(184, 146, 74, 0.12) 0%, transparent 60%)"
        }}
      ></div>
      <div 
        className="absolute -bottom-[20%] -right-[20%] w-[100%] h-[100%] filter blur-[120px] animate-pulse"
        style={{
          background: "radial-gradient(circle at center, rgba(212, 175, 112, 0.08) 0%, transparent 60%)"
        }}
      ></div>
    </div>
  );
}
