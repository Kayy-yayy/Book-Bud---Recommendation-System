"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

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
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 17l9 5l9 -5v-3l-9 5l-9 -5v-3l9 5l9 -5v-3l-9 5l-9 -5l9 -5l5.418 3.01" />
        </svg>
      );
    } else if (titleLower.includes('collaborative') || titleLower.includes('filtering')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    } else if (titleLower.includes('content-based') || titleLower.includes('tf-idf')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 14m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
          <path d="M17 14m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
          <path d="M10 6m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
          <path d="M10 8.5a6 6 0 0 0 -5 5.5" />
          <path d="M14 8.5a6 6 0 0 1 5 5.5" />
          <path d="M10 8l-6 0" />
          <path d="M20 8l-6 0" />
          <path d="M3 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M21 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        </svg>
      );
    } else if (titleLower.includes('cosine') || titleLower.includes('similarity')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M15 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path d="M3 14s.605 -5.44 2.284 -7.862m3.395 .026c2.137 2.652 4.547 9.113 6.68 11.719" />
          <path d="M18.748 18.038c.702 -.88 1.452 -3.56 2.252 -8.038" />
        </svg>
      );
    } else if (titleLower.includes('preprocessing') || titleLower.includes('pipeline')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      );
    } else if (titleLower.includes('python')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path d="M12 9H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3"></path>
          <path d="M12 15h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3"></path>
          <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4"></path>
          <path d="M11 6v.01"></path>
          <path d="M13 18v.01"></path>
        </svg>
      );
    } else if (titleLower.includes('pandas') || titleLower.includes('numpy')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M16 12.5l-5 -3l5 -3l5 3v5.5l-5 3z" />
          <path d="M11 9.5v5.5l5 3" />
          <path d="M16 12.545l5 -3.03" />
          <path d="M7 9h-5" />
          <path d="M7 12h-3" />
          <path d="M7 15h-1" />
        </svg>
      );
    } else if (titleLower.includes('next') || titleLower.includes('react')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
        </svg>
      );
    } else if (titleLower.includes('fastapi')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
        </svg>
      );
    } else if (titleLower.includes('tailwind') || titleLower.includes('css')) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M11.667 6c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 2 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968zm-4 6.5c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 1.975 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968z" />
        </svg>
      );
    } else {
      // Default icon
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={iconClass}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      );
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
