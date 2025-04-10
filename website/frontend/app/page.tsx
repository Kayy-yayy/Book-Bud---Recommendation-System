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

      {/* Recommendation Approaches Section */}
      <div className="py-16 px-4 md:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Recommendation Approaches</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ApproachCard 
              title="Popularity-Based"
              description="Recommends books based on popularity metrics like number of ratings and average rating."
              link="/popularity-based"
            />
            <ApproachCard 
              title="Content-Based"
              description="Recommends books similar to ones you like based on features like author, title, and publisher."
              link="/content-based"
            />
            <ApproachCard 
              title="Collaborative Filtering"
              description="Recommends books based on what similar users have liked, using patterns in user behavior."
              link="/collaborative"
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-black">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Contact</h2>
        <div className="max-w-md mx-auto text-center">
          <p className="mb-4">
            Feel free to reach out if you have any questions or would like to discuss this project.
          </p>
          <div className="flex flex-col gap-2">
            <p><strong>Email:</strong> your.email@example.com</p>
            <p><strong>GitHub:</strong> github.com/yourusername</p>
            <p><strong>LinkedIn:</strong> linkedin.com/in/yourprofile</p>
          </div>
        </div>
      </div>
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

const ApproachCard = ({ title, description, link }: { title: string, description: string, link: string }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-800">
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <Link href={link} className="text-blue-400 font-medium hover:underline">
        Explore {title} →
      </Link>
    </div>
  );
};
