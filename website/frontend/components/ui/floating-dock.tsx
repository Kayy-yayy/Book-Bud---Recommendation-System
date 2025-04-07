"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FloatingDockProps {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
  }[];
  className?: string;
  mobileClassName?: string;
}

export const FloatingDock = ({
  items,
  className,
  mobileClassName,
}: FloatingDockProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
        mobileClassName,
        className
      )}
    >
      <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center shadow-[0px_2px_15px_0px_#00000040]">
        {items.map((item, idx) => (
          <a
            key={item.title}
            href={item.href}
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
            className={cn(
              "relative px-3 py-2 rounded-full transition-colors duration-200",
              activeIndex === idx ? "text-white" : "text-white/60"
            )}
          >
            {activeIndex === idx && (
              <motion.div
                layoutId="pill"
                className="absolute inset-0 bg-white/10 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <div className="h-5 w-5">{item.icon}</div>
              {activeIndex === idx && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.title}
                </motion.span>
              )}
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
};
