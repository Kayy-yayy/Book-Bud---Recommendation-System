"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export const BentoGrid = ({
  className,
  children,
}: BentoGridProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {children}
    </div>
  );
};

interface BentoGridItemProps {
  className?: string;
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  ...rest
}: BentoGridItemProps & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:border-white/[0.2] border border-neutral-200 bg-white dark:bg-black/[0.8] overflow-hidden",
        className
      )}
      {...rest}
    >
      <div className="relative z-10">
        <div className="p-4">
          {header}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 tracking-wide">
              {title}
            </h3>
          </div>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
