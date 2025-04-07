"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  className?: string;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  spread?: number;
  inactiveZone?: number;
}

export const GlowingEffect = ({
  className,
  glow = true,
  disabled = false,
  proximity = 64,
  spread = 40,
  inactiveZone = 0.01,
}: GlowingEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate the distance from the center of the container
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );

      // Normalize the distance
      const maxDistance = Math.sqrt(
        Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2)
      );
      const normalizedDistance = distanceFromCenter / maxDistance;

      // If the mouse is in the inactive zone (center), reduce opacity
      const newOpacity =
        normalizedDistance < inactiveZone
          ? 0
          : Math.min(1, (1 - normalizedDistance) * 2);

      setPosition({ x, y });
      setOpacity(newOpacity);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setOpacity(0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled, inactiveZone]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      {glow && !disabled && (
        <div
          className="absolute pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-500 z-[-1]"
          style={{
            left: `${position.x - spread / 2}px`,
            top: `${position.y - spread / 2}px`,
            width: `${spread}px`,
            height: `${spread}px`,
            opacity: isHovered ? opacity : 0,
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
};
