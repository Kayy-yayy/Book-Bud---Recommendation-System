"use client";

import React, { useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { IconBook, IconStar, IconUsers, IconUserCircle, IconPackage } from "@tabler/icons-react";

// Define book type
interface Book {
  ISBN: string;
  Title: string;
  Author: string;
  Year?: number;
  Publisher?: string;
  ImageURL?: string;
  Rating?: number;
}

export default function CollaborativeFilteringPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [method, setMethod] = useState<string>("user");
  const [hasSearched, setHasSearched] = useState(false);

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      setError("Please enter a user ID");
      return;
    }
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const url = `http://localhost:8000/collaborative-filtering?user_id=${userId}&method=${method}&limit=12`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setBooks(data);
      
      if (data.length === 0) {
        setError(`No recommendations found for user ID: ${userId}`);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setError("Failed to load recommendations. Please try again later.");
      // Use mock data for development if API is not available
      setBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 relative">
      {/* Glowing effect around the margins */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowingEffect spread={100} glow={true} disabled={false} proximity={100} />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Collaborative Filtering Recommendations</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Get personalized book recommendations based on what similar users have enjoyed.
        </p>
        
        {/* Explanation Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-xl font-semibold mb-4">How Collaborative Filtering Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <IconUserCircle className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">User-Based Filtering</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recommends books based on what similar users have liked. The system finds users with similar taste to you and suggests books they've enjoyed.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <IconPackage className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Item-Based Filtering</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recommends books similar to ones you've already liked. The system analyzes patterns in book ratings to find books that are frequently liked together.
              </p>
            </div>
          </div>
        </div>
        
        {/* User Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Get Personalized Recommendations</h2>
          
          <form onSubmit={handleGetRecommendations} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">User ID</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full p-2 pl-10 border rounded-md bg-white dark:bg-gray-700"
                    placeholder="e.g., 276725"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IconUserCircle className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  For demo purposes, try user IDs: 276725, 276726, 276727
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Recommendation Method</label>
                <select 
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="user">User-Based</option>
                  <option value="item">Item-Based</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Finding Books...</span>
                  </>
                ) : (
                  <>
                    <IconUsers className="h-4 w-4" />
                    <span>Get Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Results */}
        {hasSearched && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {loading ? "Finding Books..." : 
               error ? "Recommendation Results" : 
               `Recommended Books for User ${userId}`}
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4">Generating personalized recommendations...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <BentoGrid className="max-w-7xl mx-auto">
                {books.map((book, i) => (
                  <BentoGridItem
                    key={book.ISBN}
                    title={book.Title}
                    description={`by ${book.Author}${book.Year ? ` (${book.Year})` : ''}`}
                    header={
                      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 items-center justify-center">
                        {book.ImageURL ? (
                          <img 
                            src={book.ImageURL} 
                            alt={book.Title}
                            className="h-full w-auto max-h-[150px] object-contain"
                          />
                        ) : (
                          <IconBook className="h-12 w-12 text-neutral-500" />
                        )}
                      </div>
                    }
                    icon={
                      <div className="flex items-center">
                        <IconStar className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{book.Rating ? book.Rating.toFixed(1) : 'N/A'}</span>
                      </div>
                    }
                    className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                  />
                ))}
              </BentoGrid>
            )}
          </div>
        )}
        
        {/* Initial State - Before Search */}
        {!hasSearched && (
          <div className="text-center py-12">
            <IconUsers className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Enter a User ID to Get Started</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Provide a user ID to see personalized book recommendations based on collaborative filtering.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for development
const mockBooks: Book[] = [
  {
    ISBN: "0971880107",
    Title: "The Wild Parrots of Telegraph Hill: A Love Story with Wings",
    Author: "Mark Bittner",
    Year: 2004,
    Publisher: "Harmony",
    Rating: 4.5
  },
  {
    ISBN: "0316666343",
    Title: "The Lovely Bones: A Novel",
    Author: "Alice Sebold",
    Year: 2002,
    Publisher: "Little, Brown",
    Rating: 4.2
  },
  {
    ISBN: "0385504209",
    Title: "The Da Vinci Code",
    Author: "Dan Brown",
    Year: 2003,
    Publisher: "Doubleday",
    Rating: 4.1
  },
  {
    ISBN: "0312195516",
    Title: "The Red Tent",
    Author: "Anita Diamant",
    Year: 1998,
    Publisher: "Picador USA",
    Rating: 4.3
  },
  {
    ISBN: "0142001740",
    Title: "The Secret Life of Bees",
    Author: "Sue Monk Kidd",
    Year: 2003,
    Publisher: "Penguin Books",
    Rating: 4.4
  },
  {
    ISBN: "0679781587",
    Title: "Memoirs of a Geisha",
    Author: "Arthur Golden",
    Year: 1999,
    Publisher: "Vintage",
    Rating: 4.2
  }
];
