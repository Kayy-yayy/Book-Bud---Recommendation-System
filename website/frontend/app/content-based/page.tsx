"use client";

import React, { useState } from "react";
import { HoverEffect } from "@/components/ui/hover-effect";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { IconBook, IconStar, IconSearch, IconUser, IconBarcode, IconUsers } from "@tabler/icons-react";
import { Book, api } from "@/services/api";

export default function ContentBasedPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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
      // Try to find by title first, then by author if no results
      const params = { 
        limit: 9, // Limit to 9 for a 3x3 grid
        title: searchQuery 
      };
      
      let data = await api.getContentBasedRecommendations(params);
      
      // If no results by title, try by author
      if (data.length === 0) {
        const authorParams = {
          limit: 9,
          author: searchQuery
        };
        data = await api.getContentBasedRecommendations(authorParams);
      }
      
      setBooks(data);
      
      if (data.length === 0) {
        setError(`No similar books found for "${searchQuery}"`);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      // Use mock data for development if API is not available
      const mockData = mockBooks.slice(0, 9);
      setBooks(mockData);
      
      if (mockData.length === 0) {
        setError("No similar books found. Please try a different search term.");
      } else {
        // Clear any error if we have mock data to show
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4 md:px-8 relative">
      <TracingBeam className="w-full max-w-6xl mx-auto">
        <div className="w-full mx-auto">
          
          {/* Get Similar Books Section */}
          <h1 className="text-4xl font-bold mb-6 text-white">Get Similar Books</h1>
          
          {/* Search Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-12 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <IconSearch className="h-5 w-5 mr-2 text-blue-400" />
              Search for Similar Books
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full p-4 pl-12 border border-gray-700 rounded-md bg-gray-800 text-white text-lg"
                  placeholder="Enter a book title, author name to discover similar books you might enjoy"
                  value={searchQuery}
                  onChange={(e: React.SyntheticEvent<HTMLInputElement>) => 
                    setSearchQuery((e.target as HTMLInputElement).value)
                  }
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <IconSearch className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <IconSearch className="h-4 w-4 mr-2" />
                      Find Similar Books
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Results */}
          {hasSearched && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 text-white">
                {loading ? "Searching..." : 
                 `Books Similar to "${searchQuery}"`}
              </h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-gray-300">Finding similar books...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-400">
                  <p>{error}</p>
                </div>
              ) : (
                <div className="w-full">
                  <HoverEffect
                    items={books.map((book) => ({
                      title: book.Title,
                      description: `by ${book.Author}${book.Year ? ` (${book.Year})` : ''} • ${book.Rating ? book.Rating.toFixed(1) : 'N/A'}`,
                      link: `/book/${book.ISBN}`,
                      image: book.ImageUrlL || book.ImageUrlM || book.ImageURL
                    }))}
                    className="grid-cols-3 max-w-5xl mx-auto grid-rows-3"
                  />
                </div>
              )}
            </div>
          )}
          

          
          {/* About Content-based Recommendations */}
          <h1 className="text-4xl font-bold mb-6 text-white mt-16">About Content-Based Recommendation</h1>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl mb-8">
            <div className="space-y-6 text-gray-300">
              <p className="text-lg">
                Content-based recommendation is fundamentally different from popularity-based methods. Instead of recommending what's popular among all users, it recommends items similar to what a user has liked in the past, based on the actual content or features of the items. In this case, we're using the textual information about books (title, author, publisher) to find similar books.
              </p>
              
              <h2 className="text-2xl font-semibold text-white mt-8">TF-IDF and Cosine Similarity Explained</h2>
              
              <h3 className="text-xl font-medium text-white mt-6">TF-IDF (Term Frequency-Inverse Document Frequency)</h3>
              <p>
                TF-IDF is a statistical method used to evaluate the importance of words in documents. It converts text into numerical vectors, emphasizing distinctive terms while downplaying common ones. Here's how it works:
              </p>
              
              <div className="mt-4">
                <h4 className="text-lg font-medium text-white">Components of TF-IDF</h4>
                
                <div className="mt-4">
                  <h5 className="text-base font-medium text-white">Term Frequency (TF)</h5>
                  <p className="mt-2">Measures how often a term appears in a document.</p>
                  <p className="mt-2">Formula:</p>
                  <div className="bg-gray-800 p-3 rounded-md mt-2 font-mono">
                    TF(t,d) = Number of times term t appears in document d / Total terms in document d
                  </div>
                  <p className="mt-2">Example: If "magic" appears 5 times in a 100-word book description, TF = 0.05.</p>
                </div>
                
                <div className="mt-6">
                  <h5 className="text-base font-medium text-white">Inverse Document Frequency (IDF)</h5>
                  <p className="mt-2">Measures how rare a term is across all documents.</p>
                  <p className="mt-2">Formula:</p>
                  <div className="bg-gray-800 p-3 rounded-md mt-2 font-mono">
                    IDF(t) = log(Total documents / Documents containing term t)
                  </div>
                  <p className="mt-2">Example: If "magic" appears in 10 out of 1,000 documents, IDF = log(1000/10) ≈ 2.</p>
                </div>
                
                <div className="mt-6">
                  <h5 className="text-base font-medium text-white">TF-IDF Score</h5>
                  <p className="mt-2">Combines TF and IDF:</p>
                  <div className="bg-gray-800 p-3 rounded-md mt-2 font-mono">
                    TF-IDF(t,d) = TF(t,d) × IDF(t)
                  </div>
                  <p className="mt-2">High scores indicate terms that are frequent in a document but rare elsewhere (e.g., "Hogwarts" in a Harry Potter book).</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium text-white">Why TF-IDF Matters</h4>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Focuses on Distinctive Words: Common words (e.g., "the") get low weights, while unique terms (e.g., "wizard") drive recommendations.</li>
                  <li>Handles Sparse Data: Efficiently represents text as sparse vectors, ideal for large datasets.</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-medium text-white mt-8">Cosine Similarity</h3>
              <p>
                Cosine similarity measures the similarity between two vectors by calculating the cosine of the angle between them. It's widely used in text analysis due to its efficiency and effectiveness.
              </p>
              
              <div className="mt-4">
                <h4 className="text-lg font-medium text-white">Mathematical Definition</h4>
                <div className="bg-gray-800 p-3 rounded-md mt-2 font-mono">
                  Similarity = cos(θ) = (A⋅B) / (||A|| × ||B||)
                </div>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Dot Product (A·B): Sum of the products of corresponding vector elements.</li>
                  <li>Magnitude (||A||): Euclidean length of the vector.</li>
                  <li>Range: 0 (no similarity) to 1 (identical).</li>
                </ul>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium text-white">Why Cosine Similarity Works for Text</h4>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Length-Normalized: Compares direction, not magnitude. A short book can match a long one if they share keywords.</li>
                  <li>Efficient for Sparse Data: Works well with TF-IDF vectors, which are mostly zeros.</li>
                </ul>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium text-white">TF-IDF vs. Cosine Similarity: A Synergy</h3>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 border-b border-gray-700 text-left">Aspect</th>
                        <th className="px-4 py-3 border-b border-gray-700 text-left">TF-IDF</th>
                        <th className="px-4 py-3 border-b border-gray-700 text-left">Cosine Similarity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 border-b border-gray-700">Purpose</td>
                        <td className="px-4 py-3 border-b border-gray-700">Converts text to numerical vectors.</td>
                        <td className="px-4 py-3 border-b border-gray-700">Measures similarity between vectors.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 border-b border-gray-700">Key Strength</td>
                        <td className="px-4 py-3 border-b border-gray-700">Identifies distinctive keywords.</td>
                        <td className="px-4 py-3 border-b border-gray-700">Ignores document length bias.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Use Case</td>
                        <td className="px-4 py-3">Feature extraction for text.</td>
                        <td className="px-4 py-3">Recommending similar items.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TracingBeam>
    </div>
  );
}

// Mock data for development - these will be shown when API is unavailable
const mockBooks: Book[] = [
  {
    ISBN: "0971880107",
    Title: "The Wild Parrots of Telegraph Hill: A Love Story with Wings",
    Author: "Mark Bittner",
    Year: 2004,
    Publisher: "Harmony",
    Rating: 4.5,
    ImageUrlS: "http://images.amazon.com/images/P/0971880107.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0971880107.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0971880107.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0316666343",
    Title: "The Lovely Bones: A Novel",
    Author: "Alice Sebold",
    Year: 2002,
    Publisher: "Little, Brown",
    Rating: 4.2,
    ImageUrlS: "http://images.amazon.com/images/P/0316666343.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0316666343.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0316666343.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0385504209",
    Title: "The Da Vinci Code",
    Author: "Dan Brown",
    Year: 2003,
    Publisher: "Doubleday",
    Rating: 4.1,
    ImageUrlS: "http://images.amazon.com/images/P/0385504209.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0385504209.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0385504209.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0312195516",
    Title: "The Red Tent",
    Author: "Anita Diamant",
    Year: 1998,
    Publisher: "Picador USA",
    Rating: 4.3,
    ImageUrlS: "http://images.amazon.com/images/P/0312195516.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0312195516.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0312195516.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0142001740",
    Title: "The Secret Life of Bees",
    Author: "Sue Monk Kidd",
    Year: 2003,
    Publisher: "Penguin Books",
    Rating: 4.4,
    ImageUrlS: "http://images.amazon.com/images/P/0142001740.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0142001740.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0142001740.01.LZZZZZZZ.jpg"
  },
  {
    ISBN: "0679781587",
    Title: "Memoirs of a Geisha",
    Author: "Arthur Golden",
    Year: 1999,
    Publisher: "Vintage",
    Rating: 4.2,
    ImageUrlS: "http://images.amazon.com/images/P/0679781587.01.THUMBZZZ.jpg",
    ImageUrlM: "http://images.amazon.com/images/P/0679781587.01.MZZZZZZZ.jpg",
    ImageUrlL: "http://images.amazon.com/images/P/0679781587.01.LZZZZZZZ.jpg"
  }
];
