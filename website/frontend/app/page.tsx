"use client";

import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { HoverRevealItem } from "@/components/ui/hover-reveal-item";
import Link from "next/link";
import { IconBrandPython, IconBrandReact, IconDatabase, IconChartBar, IconSearch, IconUsers } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Hero Section with Vortex */}
      <div className="w-full h-[70vh]">
        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center px-4 md:px-10 py-4 w-full h-full"
        >
          <h1 className="text-white text-2xl md:text-6xl font-bold text-center">
            Book Bud
          </h1>
          <p className="text-sm md:text-2xl max-w-xl mt-6 text-center" style={{ fontFamily: 'var(--font-work-sans)', color: 'rgba(255, 255, 255, 0.8)' }}>
            A Sophisticated Book Recommendation System Using Multiple Recommendation Approaches
          </p>
        </Vortex>
      </div>

      {/* Technologies Section */}
      <div className="py-20 px-8 md:px-16 w-full bg-black">
        {/* Table-like layout with grid for stability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 relative">
          {/* Center divider (absolute positioned for stability) */}
          <div className="hidden md:block absolute h-full w-px bg-blue-600" style={{ left: '50%', transform: 'translateX(-50%)' }}></div>
          
          {/* Machine Learning Components */}
          <div className="md:pr-12">
            <h3 className="text-xl font mb-8 text-white text-center">Machine Learning Components</h3>
            <ul className="space-y-3 text-white w-full">
              <HoverRevealItem 
                index={1}
                title="Scikit-learn" 
                description="Industry-standard ML library providing implementation of collaborative filtering, content-based algorithms, and evaluation metrics"
              />
              <HoverRevealItem 
                index={2}
                title="Collaborative Filtering Algorithms" 
                description="User-based and item-based recommendation techniques that identify patterns in user-item interactions"
              />
              <HoverRevealItem 
                index={3}
                title="Content-Based Filtering with TF-IDF Vectorization" 
                description="Text processing technique for converting book features into numerical vectors for similarity calculation"
              />
              <HoverRevealItem 
                index={4}
                title="Cosine Similarity Metrics" 
                description="Mathematical approach for measuring content similarity between books based on their vector representations"
              />
              <HoverRevealItem 
                index={5}
                title="Data Preprocessing Pipeline" 
                description="Techniques for cleaning, normalizing, and preparing book and user data for recommendation algorithms"
              />
            </ul>
          </div>
          
          {/* Mobile divider */}
          <div className="block md:hidden h-px bg-blue-600 my-8"></div>
          
          {/* Tech Stack */}
          <div className="md:pl-12">
            <h3 className="text-xl font mb-8 text-white text-center">Tech Stack Used</h3>
            <ul className="space-y-3 text-white w-full">
              <HoverRevealItem 
                index={1}
                title="Python" 
                description="Core programming language powering the backend and machine learning components"
              />
              <HoverRevealItem 
                index={2}
                title="Pandas & NumPy" 
                description="Essential data manipulation libraries for handling and processing the book and user datasets"
              />
              <HoverRevealItem 
                index={3}
                title="Next.js/React" 
                description="Modern frontend framework enabling the interactive user interface and server-side rendering"
              />
              <HoverRevealItem 
                index={4}
                title="FastAPI" 
                description="High-performance Python web framework for building the API layer"
              />
              <HoverRevealItem 
                index={5}
                title="Tailwind CSS" 
                description="Utility-first CSS framework for creating the responsive, modern UI design"
              />
            </ul>
          </div>
        </div>
      </div>



      {/* Footer with Contact Information */}
      <footer className="py-12 px-4 md:px-8 bg-gray-900 mt-auto border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Contact</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-300">
            <a href="mailto:kayy.1708@gmail.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>kayy.1708@gmail.com</span>
            </a>
            <a href="https://www.linkedin.com/in/kajalsinghai/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <span>linkedin.com/in/kajalsinghai</span>
            </a>
          </div>
          <p className="mt-8 text-gray-500 text-sm">© {new Date().getFullYear()} Book Bud. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const TechCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-800">
      <div className="flex flex-col items-center text-center">
        <div className="text-blue-400 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
};


