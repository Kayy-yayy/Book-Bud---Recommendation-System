"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  IconBrandPython,
  IconBrandReact,
  IconDatabase,
  IconChartBar,
  IconUsers,
  IconSearch
} from "@tabler/icons-react";

interface HoverRevealItemProps {
  title: string;
  description: string;
  index: number;
}

export const HoverRevealItem = ({ title, description, index }: HoverRevealItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  // Toggle for touch devices
  const handleTap = () => {
    setIsTapped(!isTapped);
  };

  const isExpanded = isHovered || isTapped;
  
  // Select appropriate icon based on title
  const icon = useMemo(() => {
    const titleLower = title.toLowerCase();
    const iconClass = "ml-2 text-blue-500 flex-shrink-0";
    const iconSize = 18;
    
    if (titleLower.includes('scikit')) {
      return <IconSearch className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('collaborative') || titleLower.includes('filtering')) {
      return <IconUsers className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('content-based') || titleLower.includes('tf-idf')) {
      return <IconSearch className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('cosine') || titleLower.includes('similarity')) {
      return <IconChartBar className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('preprocessing') || titleLower.includes('pipeline')) {
      return <IconDatabase className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('python')) {
      return <IconBrandPython className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('pandas') || titleLower.includes('numpy')) {
      return <IconDatabase className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('next') || titleLower.includes('react')) {
      return <IconBrandReact className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('fastapi')) {
      return <IconSearch className={iconClass} size={iconSize} stroke={1.5} />;
    } else if (titleLower.includes('tailwind') || titleLower.includes('css')) {
      return <IconBrandReact className={iconClass} size={iconSize} stroke={1.5} />;
    } else {
      // Default icon - we'll keep the same style but use a Tabler icon
      return <IconChartBar className={iconClass} size={iconSize} stroke={1.5} />;
    }
  }, [title]);

  return (
    <li className="relative w-full">
      {/* This outer container never changes size */}
      <div 
        className="py-4 w-full flex items-center justify-between cursor-pointer px-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleTap}
      >
        <div className="flex items-center flex-grow overflow-hidden pr-8">
          <span className="font-normal mr-3 text-gray-400 flex-shrink-0">{index}.</span>
          <span className="font-medium">{title}</span>
          {icon}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </div>
      
      {/* Description container with fixed height placeholder to prevent layout shifts */}
      <div className="w-full overflow-hidden px-4">
        <div className="min-h-0"> {/* This ensures consistent height */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pb-4 text-base text-gray-300"
              >
                {description}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Conditional bottom border */}
      {isExpanded && <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-800"></div>}
    </li>
  );
};
