"use client";

import React, { useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { IconBook, IconStar, IconSearch, IconUser, IconBarcode } from "@tabler/icons-react";
import { Book, api } from "@/services/api";

export default function ContentBasedPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<string>("title");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      let params: {
        title?: string;
        isbn?: string;
        author?: string;
        limit: number;
      } = { limit: 12 };
      
      if (searchType === "title") {
        params.title = searchQuery;
      } else if (searchType === "author") {
        params.author = searchQuery;
      } else if (searchType === "isbn") {
        params.isbn = searchQuery;
      }
      
      const data = await api.getContentBasedRecommendations(params);
      setBooks(data);
      
      if (data.length === 0) {
        setError(`No books found for ${searchType}: "${searchQuery}"`);
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
        <h1 className="text-4xl font-bold mb-2">Content-Based Recommendations</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Find books similar to ones you already enjoy based on content features like author, title, and publisher.
        </p>
        
        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search for Recommendations</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Search By</label>
                <select 
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"
                  value={searchType}
                  onChange={(e: React.SyntheticEvent<HTMLSelectElement>) => 
                    setSearchType((e.target as HTMLSelectElement).value)
                  }
                >
                  <option value="title">Book Title</option>
                  <option value="author">Author</option>
                  <option value="isbn">ISBN</option>
                </select>
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2">
                  {searchType === "title" ? "Book Title" : 
                   searchType === "author" ? "Author Name" : "ISBN"}
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full p-2 pl-10 border rounded-md bg-white dark:bg-gray-700"
                    placeholder={
                      searchType === "title" ? "e.g., The Great Gatsby" : 
                      searchType === "author" ? "e.g., J.K. Rowling" : "e.g., 9780316769488"
                    }
                    value={searchQuery}
                    onChange={(e: React.SyntheticEvent<HTMLInputElement>) => 
                      setSearchQuery((e.target as HTMLInputElement).value)
                    }
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {searchType === "title" ? (
                      <IconBook className="h-4 w-4 text-gray-400" />
                    ) : searchType === "author" ? (
                      <IconUser className="h-4 w-4 text-gray-400" />
                    ) : (
                      <IconBarcode className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
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
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <IconSearch className="h-4 w-4" />
                    <span>Find Similar Books</span>
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
              {loading ? "Searching..." : 
               error ? "Search Results" : 
               `Books Similar to "${searchQuery}"`}
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4">Finding similar books...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <BentoGrid className="max-w-7xl mx-auto">
                {books.map((book, i) => (
                  <BentoGridItem
                    key={`book-${book.ISBN || `index-${i}`}`}
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
            <IconSearch className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Search to Find Book Recommendations</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Enter a book title, author name, or ISBN to discover similar books you might enjoy.
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
