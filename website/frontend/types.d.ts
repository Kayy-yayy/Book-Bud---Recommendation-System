// React and React DOM type declarations
declare module "react" {
  export * from "react";
}

declare module "react-dom" {
  export * from "react-dom";
}

// Tabler icons type declarations
declare module "@tabler/icons-react" {
  import { FC, SVGProps } from "react";
  
  export interface TablerIconsProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    stroke?: number;
    color?: string;
    className?: string;
  }
  
  export type TablerIcon = FC<TablerIconsProps>;
  
  export const IconHome: TablerIcon;
  export const IconChartBar: TablerIcon;
  export const IconSearch: TablerIcon;
  export const IconUsers: TablerIcon;
  export const IconChartPie: TablerIcon;
  export const IconBook: TablerIcon;
  export const IconStar: TablerIcon;
  export const IconFilter: TablerIcon;
  export const IconCalendar: TablerIcon;
  export const IconBuilding: TablerIcon;
  export const IconUser: TablerIcon;
  export const IconBarcode: TablerIcon;
  export const IconUserCircle: TablerIcon;
  export const IconPackage: TablerIcon;
  export const IconChartHistogram: TablerIcon;
  export const IconChartDots: TablerIcon;
  export const IconBooks: TablerIcon;
  export const IconBrandPython: TablerIcon;
  export const IconBrandReact: TablerIcon;
  export const IconDatabase: TablerIcon;
  export const IconBox: TablerIcon;
  export const IconLock: TablerIcon;
  export const IconSettings: TablerIcon;
  export const IconSparkles: TablerIcon;
  export const IconArrowWaveRightUp: TablerIcon;
  export const IconBoxAlignRightFilled: TablerIcon;
  export const IconBoxAlignTopLeft: TablerIcon;
  export const IconClipboardCopy: TablerIcon;
  export const IconFileBroken: TablerIcon;
  export const IconSignature: TablerIcon;
  export const IconTableColumn: TablerIcon;
  export const IconBrandGithub: TablerIcon;
  export const IconBrandX: TablerIcon;
  export const IconExchange: TablerIcon;
  export const IconNewSection: TablerIcon;
  export const IconTerminal2: TablerIcon;
}
