import React from 'react';

export const RovyaLogoSymbol = ({ className = "h-8 w-8", variant = "default" }: { className?: string, variant?: "default" | "white" | "orange" }) => {
  const colors = {
    default: "#111827",
    white: "#FFFFFF",
    orange: "#F97316"
  };
  
  const color = colors[variant];
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Rovya Logo"
    >
      {/* Background shape for motion feel */}
      <path 
        d="M20 30C20 20 30 15 45 15C65 15 85 25 85 45C85 65 65 85 45 85C30 85 20 80 20 70" 
        stroke={color} 
        strokeWidth="10" 
        strokeLinecap="round" 
        className="opacity-20"
      />
      
      {/* The "R" shape stylized as a route/motion */}
      <path 
        d="M35 25V75M35 25H55C65 25 70 32 70 40C70 48 65 55 55 55H35M55 55L75 75" 
        stroke={color} 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Movement indicators */}
      <path d="M15 40H22" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <path d="M10 50H22" stroke={color} strokeWidth="6" strokeLinecap="round" />
      <path d="M15 60H22" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};

export const RovyaBrand = ({ 
  className = "", 
  variant = "default",
  subBrand = null
}: { 
  className?: string, 
  variant?: "default" | "white",
  subBrand?: "Passageiro" | "Piloto" | "Control" | "Simulator" | null
}) => {
  const textColor = variant === "white" ? "text-white" : "text-[#111827]";
  const subColor = variant === "white" ? "text-white/70" : "text-slate-500";
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <RovyaLogoSymbol 
        className="h-10 w-10" 
        variant={variant === "white" ? "white" : "default"} 
      />
      <div className="flex flex-col -space-y-1">
        <span className={`text-2xl font-black tracking-tighter ${textColor}`}>
          ROVYA
        </span>
        {subBrand && (
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${subColor}`}>
            {subBrand}
          </span>
        )}
      </div>
    </div>
  );
};
