"use client";

import React from "react";
import { Vortex } from "@/components/ui/vortex";
import Link from "next/link";
import { IconBrandPython, IconBrandReact, IconDatabase, IconChartBar, IconSearch, IconUsers } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Vortex */}
      <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[70vh] overflow-hidden">
        <Vortex
          backgroundColor="black"
          baseHue={220}
          particleCount={800}
          baseSpeed={0.2}
          rangeSpeed={2.0}
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
          <h1 className="text-white text-2xl md:text-6xl font-bold text-center">
            Book Bud
          </h1>
          <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
            A sophisticated book recommendation system using multiple recommendation approaches
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Link href="/content-based" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
              Discover Books
            </Link>
            <Link href="/eda" className="px-4 py-2 text-white hover:text-blue-200 transition duration-200">
              Explore Data Analysis
            </Link>
          </div>
        </Vortex>
      </div>

      {/* Technologies Section */}
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Technologies Used</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TechCard 
            icon={<IconBrandPython size={48} />}
            title="Python"
            description="Core language used for data processing and recommendation algorithms"
          />
          <TechCard 
            icon={<IconDatabase size={48} />}
            title="Pandas & NumPy"
            description="Data manipulation and numerical computations"
          />
          <TechCard 
            icon={<IconChartBar size={48} />}
            title="Scikit-learn"
            description="Machine learning algorithms for recommendation systems"
          />
          <TechCard 
            icon={<IconSearch size={48} />}
            title="TF-IDF Vectorization"
            description="Text processing for content-based filtering"
          />
          <TechCard 
            icon={<IconUsers size={48} />}
            title="Collaborative Filtering"
            description="User-based and item-based recommendation approaches"
          />
          <TechCard 
            icon={<IconBrandReact size={48} />}
            title="Next.js & React"
            description="Frontend framework for the web interface"
          />
        </div>
      </div>

      {/* Recommendation Approaches Section */}
      <div className="py-16 px-4 md:px-8 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recommendation Approaches</h2>
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
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Contact</h2>
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="text-blue-600 dark:text-blue-400 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

const ApproachCard = ({ title, description, link }: { title: string, description: string, link: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <Link href={link} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
        Explore {title} →
      </Link>
    </div>
  );
};
