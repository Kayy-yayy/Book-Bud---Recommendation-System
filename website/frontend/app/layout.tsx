import type { Metadata } from "next";
import { Inter, Montserrat, Nunito_Sans, Work_Sans } from "next/font/google";
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
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito-sans" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });

export const metadata: Metadata = {
  title: "Book Bud - Book Recommendation System",
  description: "A sophisticated book recommendation system using multiple recommendation approaches",
};

const navItems = [
  {
    title: "Home",
    icon: <IconHome className="h-full w-full text-white" />,
    href: "/",
  },
  {
    title: "Popularity-Based",
    icon: <IconChartBar className="h-full w-full text-white" />,
    href: "/popularity-based",
  },
  {
    title: "Content-Based",
    icon: <IconSearch className="h-full w-full text-white" />,
    href: "/content-based",
  },
  {
    title: "Collaborative",
    icon: <IconUsers className="h-full w-full text-white" />,
    href: "/collaborative",
  },
  {
    title: "EDA",
    icon: <IconChartPie className="h-full w-full text-white" />,
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
      <body className={`${inter.variable} ${montserrat.variable} ${nunitoSans.variable} ${workSans.variable} font-sans bg-black text-white min-h-screen overflow-x-hidden`}>
        <main className="min-h-screen">
          {children}
        </main>
        <FloatingDock 
          items={navItems} 
          desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2 z-50" 
          mobileClassName="fixed bottom-8 right-8 z-50" 
        />
      </body>
    </html>
  );
}
