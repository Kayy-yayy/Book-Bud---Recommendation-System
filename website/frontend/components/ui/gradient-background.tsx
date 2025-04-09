"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientBackground = ({
  children,
  className,
}: GradientBackgroundProps) => {
  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute -inset-[100px] opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0) 70%)",
            }}
            animate={{
              x: ["-25%", "25%", "-25%"],
              y: ["-25%", "25%", "-25%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -inset-[100px] opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,0) 70%)",
            }}
            animate={{
              x: ["25%", "-25%", "25%"],
              y: ["25%", "-25%", "25%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -inset-[100px] opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(139,92,246,0) 70%)",
            }}
            animate={{
              x: ["-15%", "15%", "-15%"],
              y: ["15%", "-15%", "15%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut",
            }}
          />
        </div>
        
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')",
            backgroundRepeat: "repeat"
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
