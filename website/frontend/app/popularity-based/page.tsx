"use client";

import React, { useState, useEffect } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { 
  IconBook, 
  IconStar, 
  IconFilter, 
  IconCalendar, 
  IconBuilding 
} from "@tabler/icons-react";
import { Book, api } from "@/services/api";

export default function PopularityBasedPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("overall");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [publisherFilter, setPublisherFilter] = useState<string>("");

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const fetchPopularBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data: Book[];
      
      if (filterType === "overall") {
        data = await api.getPopularBooks({ criteria: "overall", limit: 12 });
      } else if (filterType === "year" && yearFilter) {
        data = await api.getPopularBooksByYear({ year: parseInt(yearFilter), limit: 12 });
      } else if (filterType === "publisher" && publisherFilter) {
        data = await api.getPopularBooksByPublisher({ publisher: publisherFilter, limit: 12 });
      } else {
        data = await api.getPopularBooks({ criteria: "overall", limit: 12 });
      }
      
      setBooks(data);
      
      if (data.length === 0) {
        setError("No books found with the selected criteria");
      }
    } catch (err) {
      console.error("Failed to fetch popular books:", err);
      setError("Failed to load popular books. Please try again later.");
      // Use mock data for development if API is not available
      setBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    setFilterType((e.target as HTMLSelectElement).value);
  };

  const handleYearChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setYearFilter((e.target as HTMLInputElement).value);
  };

  const handlePublisherChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setPublisherFilter((e.target as HTMLInputElement).value);
  };

  const handleApplyFilter = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchPopularBooks();
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 relative">
      {/* Glowing effect around the margins */}
      <div className="absolute inset-0 pointer-events-none">
        <GlowingEffect spread={100} glow={true} disabled={false} proximity={100} />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Popularity-Based Recommendations</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Discover the most popular books based on ratings and reviews from readers around the world.
        </p>
        
        {/* Filter Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Filter Popular Books</h2>
          
          <form onSubmit={handleApplyFilter} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Filter By</label>
                <div className="relative">
                  <select 
                    className="w-full p-2 pl-10 border rounded-md bg-white dark:bg-gray-700"
                    value={filterType}
                    onChange={handleFilterChange}
                  >
                    <option value="overall">Overall Popularity</option>
                    <option value="year">Publication Year</option>
                    <option value="publisher">Publisher</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IconFilter className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {filterType === "year" && (
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-2">Publication Year</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full p-2 pl-10 border rounded-md bg-white dark:bg-gray-700"
                      placeholder="e.g., 2010"
                      value={yearFilter}
                      onChange={handleYearChange}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <IconCalendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
              
              {filterType === "publisher" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Publisher Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full p-2 pl-10 border rounded-md bg-white dark:bg-gray-700"
                      placeholder="e.g., Penguin Books"
                      value={publisherFilter}
                      onChange={handlePublisherChange}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <IconBuilding className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`md:col-span-${filterType === "overall" ? "3" : "2"} flex items-end`}>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <IconFilter className="h-4 w-4" />
                      <span>Apply Filter</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Results */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {loading ? "Loading..." : 
             error ? "Popular Books" : 
             filterType === "overall" ? "Most Popular Books Overall" :
             filterType === "year" ? `Most Popular Books from ${yearFilter}` :
             `Most Popular Books from ${publisherFilter}`}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4">Loading popular books...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <BentoGrid className="max-w-7xl mx-auto">
              {books.map((book, i) => (
                <BentoGridItem
                  key={`book-${book.ISBN || i}`}
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
