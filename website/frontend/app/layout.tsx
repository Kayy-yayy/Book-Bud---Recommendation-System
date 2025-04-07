import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FloatingDock } from "@/components/ui/floating-dock";
import { 
  IconHome, 
  IconChartBar, 
  IconSearch, 
  IconUsers, 
  IconChartPie 
} from "@tabler/icons-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Book Bud - Book Recommendation System",
  description: "A sophisticated book recommendation system using multiple recommendation approaches",
};

const navItems = [
  {
    title: "Home",
    icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "/",
  },
  {
    title: "Popularity-Based",
    icon: <IconChartBar className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "/popularity-based",
  },
  {
    title: "Content-Based",
    icon: <IconSearch className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "/content-based",
  },
  {
    title: "Collaborative",
    icon: <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "/collaborative",
  },
  {
    title: "EDA",
    icon: <IconChartPie className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: "/eda",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <main className="min-h-screen">
          {children}
        </main>
        <FloatingDock items={navItems} />
      </body>
    </html>
  );
}
